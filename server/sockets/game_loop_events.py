from flask import request
from flask_socketio import emit


class GameLoopEvents:
    def __init__(self,game_manager,socketio):
        
        self.game_manager = game_manager
        self.socketio = socketio
        self.game_loop_events()

    def game_loop_events(self):

        @self.socketio.on("move")
        def handle_move(data):

            color = data.get("color")
            room = data.get("room")

            square_from = data.get("from")
            square_to = data.get("to")
            promotion = data.get("promotion")

            move = square_from + square_to

            if promotion:
                move = move + promotion
                print(f"New move is {move}")

            game_room = self.game_manager.get_room(room)
            game = game_room.game

            response = game.handle_move(move)

            emit(
                "move",
                {"valid": response["valid"], "fen": response["fen"], "color": color},
                to=room,
            )

            fen = response["fen"]
            self.is_game_over(game, color, fen, room)

            # Check engine move only applies if mode is PVE
            response = game.engine_move()

            if response:
                emit(
                    "move", {"move": response["move"], "fen": response["fen"]}, to=room
                )

                engine_color = game.get_engine_color()
                self.is_game_over(game, engine_color, fen, room)

        @self.socketio.on("resign")
        def handle_resign(data):
            color = data.get("color")
            room = data.get("room")

            game_room = self.game_manager.get_room(room)
            game = game_room.game

            winner = "white"

            if color == "white":
                winner = "black"

            winner = winner.capitalize()
            color = color.capitalize()

            message = f"{color} has resigned winner is {winner}"
            fen = game.get_fen()

            self.game_over(message, fen, room)

            print(f"{color} resigned ending game")

        @self.socketio.on("draw")
        def handle_draw(data):
            room = data.get("room")
            status = data.get("status")
            sid = request.sid

            game_room = self.game_manager.get_room(room)
            game = game_room.game

            if status == "offer":
                opponent_sid = game_room.get_opponent_sid(room, sid)
                emit("draw", to=opponent_sid)

            elif status == "accept":
                message = "Both players agreed on a draw"
                fen = game.get_fen()

                self.game_over(message, fen, room)

            print(f"Got draw status: {status}")

    def is_game_over(self, game, color, fen, room):
        winner_message = game.get_winner(color)

        if winner_message:
            self.game_over(winner_message, fen, room)

    def game_over(self, winner_message, fen, room):
        emit("game_over", {"message": winner_message, "fen": fen}, to=room)

        self.game_manager.end_game(room)
