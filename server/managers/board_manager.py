import chess
import random


class BoardManager:
    def __init__(self, room_number):
        self.boards = {}
        self.current_board = 0
        self.room_number = room_number
        self.colors = ["white", "black"]
        self.turn_count = {}

    def get_colors(self):
        random.shuffle(self.colors)
        return self.colors

    def create_new_board(self, game_room):
        self.boards[game_room] = chess.Board()
        self.turn_count[game_room] = 1
        return self.boards[game_room]

    def get_legal_moves(self, room_number):
        board = self.boards.get(room_number)
        if not board:
            print("board is empty")
            return []

        uci_moves = [move.uci() for move in board.legal_moves]
        return uci_moves

    def valid_move(self, move, room_number):
        if move not in self.get_legal_moves(room_number):
            return False

        return True

    def is_tie(self, room_number):
        board = self.boards.get(room_number)
        if (
            board.is_stalemate()
            or board.is_insufficient_material()
            or board.can_claim_threefold_repetition()
            or board.is_seventyfive_moves()
        ):
            return True

        return False

    def is_checkmate(self, room_number):
        board = self.boards.get(room_number)
        if board.is_checkmate():
            return True

        return False

    def push_board(self, move, room_number):
        board = self.boards[room_number]
        
        move_obj = chess.Move.from_uci(move)
        san_move = board.san(move_obj)
        board.push_uci(move)
            
        return san_move
    def get_board_fen(self, room_number):
        board = self.boards[room_number]
        return board.fen()

    def get_current_turn(self,room):
        return self.turn_count[room]
    
    def inc_turn(self,room):
        self.turn_count[room] += 1