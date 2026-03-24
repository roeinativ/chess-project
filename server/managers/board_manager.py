import chess
import random


class Board:
    def __init__(self):
        self.board = chess.Board()
        self.current_board = 0
        self.colors = ["white", "black"]

    def get_colors(self):
        random.shuffle(self.colors)
        return self.colors

    def get_legal_moves(self):
        if not self.board:
            print("board is empty")
            return []

        uci_moves = [move.uci() for move in self.board.legal_moves]
        return uci_moves

    def valid_move(self, move):
        if move not in self.get_legal_moves():
            return False

        return True

    def is_tie(self):
        
        if (
            self.board.is_stalemate()
            or self.board.is_insufficient_material()
            or self.board.can_claim_threefold_repetition()
            or self.board.is_seventyfive_moves()
        ):
            return True

        return False

    def is_checkmate(self):
        
        if self.board.is_checkmate():
            return True

        return False

    def push_board(self, move):
        
        move_obj = chess.Move.from_uci(move)
        san_move = self.board.san(move_obj)
        self.board.push_uci(move)
            
        return san_move
    
    def get_board_fen(self):
        return self.board.fen()

