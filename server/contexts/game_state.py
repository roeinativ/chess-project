class GameState():
    def __init__(self):
        self.players_time = {}
        self.current_turn = {}  # Used in game clock
        self.current_fen = {}
        self.game_history = {}
        self.sid_color = {}