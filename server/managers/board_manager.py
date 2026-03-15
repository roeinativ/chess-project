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

    def create_new_board(self, game_room):
      self.boards[game_room] = chess.Board()
      return self.boards[game_room]

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
        if board.is_stalemate() or board.is_insufficient_material() or board.can_claim_threefold_repetition() or board.is_seventyfive_moves():
            return True

        return False

    def is_checkmate(self,room_number):
        board = self.boards.get(room_number)
        if board.is_checkmate():
            return True
        
        return False
    
    def push_board(self,move,room_number):
        self.boards[room_number].push_uci(move)
        
    def get_board_fen(self,room_number):
        board = self.boards[room_number]
        return board.fen()
    