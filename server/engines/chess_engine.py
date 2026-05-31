from stockfish import Stockfish
import os


class ChessEngine:
    def __init__(self):
        self.BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        self.ENGINE_PATH = os.path.join(self.BASE_DIR, "stockfish-windows-x86-64-avx2.exe")

        self.params = {
            "Threads": 1,
            "Hash": 128,
            "Skill Level": 10,
            "Move Overhead": 30,
        }

    def create_instance(self):
        if not os.path.exists(self.ENGINE_PATH):
            print(f"Stockfish not found")
            return None
        
        return Stockfish(path=self.ENGINE_PATH, depth=12, parameters=self.params)

    def get_best_move(self, fen):
        sf = self.create_instance()
        
        if sf:
            sf.set_fen_position(fen)
            best_move = sf.get_best_move_time(2000)
            return best_move
