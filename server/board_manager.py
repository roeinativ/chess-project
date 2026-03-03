import chess

class BoardManager: 
    def __init__(self,room_number):
        self.boards = {}
        self.current_board = 0
        self.room_number = room_number
        self.board = self.boards.get(self.room_number)

    def create_new_board(self):
        self.current_board += 1
        self.boards[self.current_board] = chess.Board()
        return self.boards[self.current_board]

    def get_legal_moves(self):
        if not self.board:
            return []

        uci_moves = [move.uci() for move in self.board.legal_moves]
        return uci_moves

    def valid_move(self,move):
        if move not in self.get_legal_moves():
            return False

        return True

    def is_tie(self):
        if self.board.is_stalemate() or self.board.is_insufficient_material() or self.board.is_fivefold_repetition or self.board.is_seventyfive_moves():
            return True

        return False

    def is_checkmate(self):
        if self.board.is_checkmate():
            return True
        
        return False