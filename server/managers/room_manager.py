from game import Game


class Room:
    def __init__(
        self,
        room_id,
        mode,
        stockfish,
        signed_in_clients,
    ):

        self.room_id = room_id
        self.mode = mode
        self.stockfish = stockfish
        self.signed_in_clients = signed_in_clients
        self.game = None
        self.players = []
        self.MAX_PLAYERS_PVP = 2
        self.MAX_PLAYERS_PVE = 1

    def reset_room(self):
        self.players = []
        self.game = None

    def start_game(self):
        self.game = Game(
            self.mode, self.stockfish, self.players, self.signed_in_clients, self.room_id
        )
        self.game.init_sid_color(self.players)

    def get_room(self):
        return self.room_id

    def is_room_full(self):
        if len(self.players) >= self.get_max_players():
            print(self.players)
            return True

        return False

    def add_player(self, sid):
        self.players.append(sid)
        
    def remove_player(self, sid):
        self.players.remove(sid)

    def game_on(self):
        if len(self.players) >= self.get_max_players():
            return True

        return False

    def get_opponent_sid(self, sid):
        for player_sid in self.players:
            if player_sid != sid:
                return player_sid

    def get_max_players(self):

        if self.mode == "PVP":
            return self.MAX_PLAYERS_PVP

        return self.MAX_PLAYERS_PVE

    def exit_room(self):
        self.game.end_game()