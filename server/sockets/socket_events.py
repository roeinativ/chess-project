from flask_socketio import join_room, leave_room
from .matchmaking_events import MatchmakingEvents
from .game_loop_events import GameLoopEvents
from .connection_events import ConnectionEvents


class SocketEvents:
    def __init__(self, game_manager, socketio, signed_in_clients):
        self.game_manager = game_manager
        self.socketio = socketio
        self.signed_in_clients = signed_in_clients
        self.starting_time = 300000000
        self.socket_events()

    def socket_events(self):

        MatchmakingEvents(
            self.game_manager,
            self.socketio,
        )

        GameLoopEvents(
            self.game_manager, 
            self.socketio,
        )

        ConnectionEvents(
            self.game_manager,
            self.socketio,
            self.signed_in_clients,
        )
