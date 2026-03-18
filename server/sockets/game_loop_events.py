from flask import request
from flask_socketio import emit

class GameLoopEvents():
    def __init__(self, socketio, room_manager, board_manager, signed_in_clients, stockfish, current_turn, game_history, current_fen, game_over):
        self.socketio = socketio
        self.room_manager = room_manager
        self.board_manager = board_manager
        self.signed_in_clients = signed_in_clients
        self.stockfish = stockfish
        self.current_turn = current_turn
        self.game_history = game_history
        self.current_fen = current_fen
        self.game_over = game_over
        self.game_loop_events()

    def game_loop_events(self):

        @self.socketio.on("move")
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
                self.current_turn[room] = 1 - self.current_turn[room]

            move = square_from + square_to

            if promotion:
                move = move + promotion
                print(f"New move is {move}")

            # Checks if move is valid
            if self.board_manager.valid_move(move, room):

                # Push current game virtual server board and get fen
                san_move = self.board_manager.push_board(move, room)
                fen = self.board_manager.get_board_fen(room)
                self.current_fen = fen

                # Check if checkmate or tie and change the winner
                if self.board_manager.is_checkmate(room):
                    winner = color

                elif self.board_manager.is_tie(room):
                    winner = "t"

                else:
                    winner = None

                if mode == "PVE":
                    emit(
                        "is_move_valid",
                        {"from": square_from, "to": square_to, "valid": True},
                        to=sid,
                    )

                    engine_move = self.stockfish.get_best_move(fen)
                    self.board_manager.push_board(engine_move, room)
                    fen = self.board_manager.get_board_fen(room)
                    self.current_fen = fen

                    emit("move", {"fen": fen}, to=sid)

                    # Checks if stockfish won

                    if self.board_manager.is_checkmate(room):
                        message = "Engine has won the game"

                    elif self.board_manager.is_tie(room):
                        message = "Tie"

                    else:
                        message = None

                    if message:
                        self.game_over(room, message, mode)

                else:
                    # If normal move emit to player:

                    # Add move to game history

                    turn = self.board_manager.get_current_turn(room) - 1

                    if self.current_turn[room] == 1:
                        
                        self.game_history[room].append(
                            {
                                "turn": self.board_manager.get_current_turn(room),
                                "white_move": None,
                                "black_move": None,
                            }
                        )
                        
                        self.game_history[room][turn]["white_move"] = san_move

                    else:
                        self.game_history[room][turn]["black_move"] = san_move
                        self.board_manager.inc_turn(room)

                    # Emit to current player
                    emit(
                        "is_move_valid",
                        {"from": square_from, "to": square_to, "valid": True},
                        to=sid,
                    )

                    # Emit to opponent
                    opponent_sid = self.room_manager.get_opponent_sid(room, sid)
                    emit("move", {"fen": fen}, to=opponent_sid)
                    print("Move valid sending to opponent")

                if winner:
                    message = f"Game over {winner} has won the game"

                    sids = self.room_manager.get_room_sids(room)
                    self.game_over(room, message, mode, winner ,sids)

                    print(f"Winner: {winner}, emiting to room {room}")

            else:
                print("Move not valid")

        @self.socketio.on("resign")
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

            sids = self.room_manager.get_room_sids(room)
            self.game_over(room, message, mode, winner ,sids)

            print(f"{color} resigned ending game")

        @self.socketio.on("draw")
        def handle_draw(data):
            room = data.get("room")
            status = data.get("status")
            mode = data.get("mode")
            sid = request.sid

            if status == "offer":
                opponent_sid = self.room_manager.get_opponent_sid(room, sid)
                emit("draw", to=opponent_sid)

            elif status == "accept":
                message = "Both players agreed on a draw"
                sids = self.room_manager.get_room_sids(room)
                self.game_over(room, message, mode, "Draw" ,sids)

            print(f"Got draw status: {status}")
