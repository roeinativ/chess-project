from flask import request
from flask_socketio import emit


class GameLoopEvents:
    def __init__(self, context, state, set_fen, game_over):
        self.game_over = game_over
        self.set_fen = set_fen
        self.context = context
        self.state = state
        self.game_loop_events()

    def game_loop_events(self):

        @self.context.socketio.on("move")
        def handle_move(data):

            sid = request.sid
            color = data.get("color")
            room = data.get("room")
            mode = data.get("mode")

            square_from = data.get("from")
            square_to = data.get("to")
            promotion = data.get("promotion")

            # Handle clock function
            if mode == "PVP":
                self.state.current_turn[room] = 1 - self.state.current_turn[room]

            move = square_from + square_to

            if promotion:
                move = move + promotion
                print(f"New move is {move}")

            # Checks if move is valid
            if self.context.board_manager.valid_move(move, room):

                # Push current game virtual server board and get fen
                san_move = self.context.board_manager.push_board(move, room)
                fen = self.context.board_manager.get_board_fen(room)
                self.set_fen(room,fen)

                # Check if checkmate or tie and change the winner
                if self.context.board_manager.is_checkmate(room):
                    winner = color

                elif self.context.board_manager.is_tie(room):
                    winner = "t"

                else:
                    winner = None

                if mode == "PVE":
                    emit(
                        "is_move_valid",
                        {"from": square_from, "to": square_to, "valid": True},
                        to=sid,
                    )

                    engine_move = self.context.stockfish.get_best_move(fen)
                    self.context.board_manager.push_board(engine_move, room)
                    fen = self.context.board_manager.get_board_fen(room)
                    self.set_fen(room,fen)

                    emit("move", {"fen": self.state.current_fen[room]}, to=sid)

                    # Checks if stockfish won

                    if self.context.board_manager.is_checkmate(room):
                        message = "Engine has won the game"

                    elif self.context.board_manager.is_tie(room):
                        message = "Tie"

                    else:
                        message = None

                    if message:
                        self.game_over(room, message, mode)

                else:
                    # If normal move emit to player:

                    # Add move to game history

                    turn = self.context.board_manager.get_current_turn(room) - 1

                    if self.state.current_turn[room] == 1:

                        self.state.game_history[room].append(
                            {
                                "turn": self.context.board_manager.get_current_turn(
                                    room
                                ),
                                "white_move": None,
                                "black_move": None,
                            }
                        )

                        self.state.game_history[room][turn]["white_move"] = san_move

                    else:
                        self.state.game_history[room][turn]["black_move"] = san_move
                        self.context.board_manager.inc_turn(room)

                    # Emit to current player
                    emit(
                        "is_move_valid",
                        {"from": square_from, "to": square_to, "valid": True},
                        to=sid,
                    )

                    # Emit to opponent
                    opponent_sid = self.context.room_manager.get_opponent_sid(room, sid)
                    emit("move", {"fen": self.state.current_fen[room]}, to=opponent_sid)
                    print("Move valid sending to opponent")

                if winner:
                    message = f"Game over {winner} has won the game"

                    sids = self.context.room_manager.get_room_sids(room)
                    self.game_over(room, message, mode, winner, sids)

                    print(f"Winner: {winner}, emiting to room {room}")

            else:
                print("Move not valid")

        @self.context.socketio.on("resign")
        def handle_resign(data):
            color = data.get("color")
            room = data.get("room")
            mode = data.get("mode")

            winner = "white"

            if color == "white":
                winner = "black"

            winner = winner.capitalize()
            color = color.capitalize()

            message = f"{color} has resigned winner is {winner}"

            sids = self.context.room_manager.get_room_sids(room)
            self.game_over(room, message, mode, winner, sids)

            print(f"{color} resigned ending game")

        @self.context.socketio.on("draw")
        def handle_draw(data):
            room = data.get("room")
            status = data.get("status")
            mode = data.get("mode")
            sid = request.sid

            if status == "offer":
                opponent_sid = self.context.room_manager.get_opponent_sid(room, sid)
                emit("draw", to=opponent_sid)

            elif status == "accept":
                message = "Both players agreed on a draw"
                sids = self.context.room_manager.get_room_sids(room)
                self.game_over(room, message, mode, "Draw", sids)

            print(f"Got draw status: {status}")
