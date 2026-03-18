class GameContext():
    def __init__(self, socketio, room_manager, board_manager, signed_in_clients, stockfish):
        self.socketio = socketio
        self.room_manager = room_manager
        self.board_manager = board_manager
        self.signed_in_clients = signed_in_clients
        self.home = room_manager.get_home()
        self.stockfish = stockfish