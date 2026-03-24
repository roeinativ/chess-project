from managers.board_manager import Board
from models.extensions import db
from models.games import GameHistory


class Game:
    def __init__(
        self, mode, stockfish, players, signed_in_clients, room_id, app
    ):
        self.board = Board()
        self.mode = mode
        self.stockfish = stockfish
        self.players = players
        self.signed_in_clients = signed_in_clients
        self.room_id = room_id
        self.app = app
        
        self.color_turn = 0
        self.turn_count = 1
        
        self.game_history = []
        self.players_time = []
        
        self.starting_time = 300
        self.sid_color = {}
        self.colors = ["white", "black"]
        self.winner = "Draw"

    def init_sid_color(self,sids):
        for i in range(len(sids)):
            self.sid_color[sids[i]] = self.colors[i]


    def start_players_time(self):

        if self.mode == "PVP":
            self.players_time = [
                self.starting_time,
                self.starting_time,
            ]

    def add_player_color(self, sid, color):
        self.sid_color[sid] = color

    def get_player_color(self, sid):
        return self.sid_color[sid]

    def handle_move(self, move):

        if not self.board.valid_move(move):
            print("Move was not valid")
            return {"valid": False}

        san_move = self.board.push_board(move)

        response = {
            "valid": True,
            "fen": self.get_fen(),
        }

        # If mode is PVP append to game history
        if self.mode == "PVP":

            # If white made move create a new turn
            if self.color_turn == 0:
                self.game_history.append(
                    {
                        "turn": self.turn_count,
                        "white_move": san_move,
                        "black_move": None,
                    }
                )

            # If black made move append black move
            else:
                self.game_history[-1]["black_move"] = san_move
                self.turn_count += 1

            self.color_turn = 1 - self.color_turn

        print("Move was valid")
        return response

    def get_winner(self, color):

        if self.board.is_checkmate():
            self.winner = color
            return f"Checkmate winner is {color}"

        elif self.board.is_tie():
            self.winner = "Draw"
            return "Tie"

        return None

    def engine_move(self):

        if self.mode == "PVE":
            fen = self.get_fen()
            best_move = self.stockfish.get_best_move(fen)

            self.board.push_board(best_move)
            fen = self.get_fen()

            return {
                "move": best_move,
                "fen": fen,
            }

        return None

    def get_engine_color(self):
        player_sid = self.players[0]
        player_color = self.sid_color[player_sid]

        if player_color == "white":
            return "black"

        return "white"

    def end_game(self):

        if self.mode == "PVP":
            
            print("players list:", self.players)
            print("all signed in clients:", self.signed_in_clients.signed_in_clients)
            with self.app.app_context():
                usernames = []

                first_player = self.players[0]
                if self.sid_color[first_player] != "white":
                    self.players.reverse()

                for i in range(len(self.players)):
                    player_sid = self.players[i]

                    found_user = self.signed_in_clients.get_username(player_sid)
                    usernames.append(found_user)

                new_game_history = GameHistory(
                    usernames[0], usernames[1], self.winner, self.game_history
                )
                
        
                db.session.add(new_game_history)
                db.session.commit()
                
                print(new_game_history)

    def get_fen(self):
        return self.board.get_board_fen()

    def count_time(self, socketio):
        
        if self.mode != "PVP":
            return

        winner = "white"
        game_on = True

        while game_on:
            socketio.sleep(1)
            self.players_time[self.color_turn] -= 1

            if self.players_time[self.color_turn] <= 0:

                winner_index = 1 - self.color_turn
                if winner_index == 1:
                    winner = "black"
                    
                self.winner = winner
                
                message = f"Time run out winner is {winner}"
                self.end_game()
                
                socketio.emit("game_over", {
                    "message": message,
                    "fen": self.get_fen()
                }, to=self.room_id)
                
                game_on = False
                

