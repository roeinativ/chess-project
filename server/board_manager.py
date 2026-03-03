import chess
import random

class BoardManager: 
    def __init__(self,room_number):
        self.boards = {}
        self.current_board = 0
        self.room_number = room_number
        self.colors = ['white','black']
        
    
        
    def get_colors(self):
        random.shuffle(self.colors)
        return self.colors

    def create_new_board(self):
        self.current_board += 1
        self.boards[self.current_board] = chess.Board()
        
        return self.boards[self.current_board]

    def get_legal_moves(self,room_number):
        board = self.boards.get(room_number)
        if not board:
            print("board is empty")
            return []

        uci_moves = [move.uci() for move in board.legal_moves]
        return uci_moves

    def valid_move(self,move,room_number):
        if move not in self.get_legal_moves(room_number):
            return False

        return True

    def is_tie(self, room_number):
        board = self.boards.get(room_number)
        if self.board.is_stalemate() or board.is_insufficient_material() or board.is_fivefold_repetition or board.is_seventyfive_moves():
            return True

        return False

    def is_checkmate(self):
        if self.board.is_checkmate():
            return True
        
        return False
    
    def push_board(self,move,room_number):
        self.boards[room_number].push_san(move)
        
    def get_board_fen(self,room_number):
        board = self.boards[room_number]
        return board.fen()