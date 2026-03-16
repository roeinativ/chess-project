from stockfish import Stockfish


class ChessEngine:
    def __init__(self):
        self.ENGINE_PATH = r"C:\Users\roein\chess-project\server\engines\stockfish-windows-x86-64-avx2.exe"

        self.params = {
            "Threads": 1,
            "Hash": 128,
            "Skill Level": 10,
            "Move Overhead": 30,
        }

    def create_instance(self):
        return Stockfish(path=self.ENGINE_PATH, depth=12, parameters=self.params)

    def get_best_move(self, fen):
        sf = self.create_instance()
        sf.set_fen_position(fen)
        best_move = sf.get_best_move_time(2000)
        return best_move
