from flask_socketio import join_room, leave_room
from models.games import GameHistory, db
from .matchmaking_events import MatchmakingEvents
from .game_loop_events import GameLoopEvents
from .connection_events import ConnectionEvents


class SocketEvents:
    def __init__(self, socketio, room_manager, board_manager, signed_in_clients, stockfish, app):
        self.socketio = socketio
        self.room_manager = room_manager
        self.board_manager = board_manager
        self.signed_in_clients = signed_in_clients
        self.home = room_manager.get_home()
        self.stockfish = stockfish
        self.players_time = {}
        self.starting_time = 300000000
        self.current_turn = {}  # Used in game clock
        self.current_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        self.game_history = {}
        self.sid_color = {}
        self.app = app
        self.socket_events()

    def socket_events(self):

        MatchmakingEvents(
            self.socketio,
            self.room_manager,
            self.board_manager,
            self.signed_in_clients,
            self.stockfish,
            self.players_time,
            self.starting_time,
            self.current_turn,
            self.game_history,
            self.count_time,
            self.sid_color
        )

        GameLoopEvents(
            self.socketio,
            self.room_manager,
            self.board_manager,
            self.signed_in_clients,
            self.stockfish,
            self.current_turn,
            self.game_history,
            self.current_fen,
            self.game_over
        )
        
        ConnectionEvents(
            self.socketio, self.room_manager, self.signed_in_clients
        )
    

    def leave_game(self, room):
        sid_list = self.room_manager.get_room_sids(room)
        sid_list_copy = list(sid_list)

        for player_sid in sid_list_copy:

            self.room_manager.remove_from_room(player_sid)
            self.socketio.server.leave_room(player_sid,room)

            self.room_manager.add_to_home(player_sid)
            self.socketio.server.enter_room(player_sid, self.home)
            
        print(f"Home users {self.room_manager.get_home_users()}")
        
        
    def game_over(self,room,message, mode, winner=None ,sids=None):
        self.socketio.emit("game_over", {"message": message, "fen": self.current_fen}, to=room)

        with self.app.app_context():
            if mode == "PVP":
                
                for i in range(len(sids)):
                    player_sid = sids[i]
                    
                    if self.sid_color[player_sid] == "white":
                        first_player_sid = player_sid
                        
                    else:
                        second_player_sid = player_sid
                        
                    del self.sid_color[player_sid]
                                
                first_username = self.signed_in_clients.get_username(first_player_sid)
                second_username = self.signed_in_clients.get_username(second_player_sid)
                
                game_history = self.game_history[room]
                new_game_history = GameHistory(first_username,second_username, winner ,game_history)
                del self.game_history[room]
                
                db.session.add(new_game_history)
                db.session.commit()
                
                print(new_game_history)
                    
            self.leave_game(room)

    def count_time(self,room, mode):
        winner = "white"
        while room in self.players_time:
            self.socketio.sleep(1)
            current_player = self.current_turn[room]
            self.players_time[room][current_player] -= 1000

            if self.players_time[room][current_player] <= 0:

                winner_index = 1 - current_player
                if winner_index == 1:
                    winner = "black"
                
                message = f"Time run out winner is {winner}"
                    
                sids = self.room_manager.get_room_sids(room)  
                
                del self.players_time[room]
                del self.current_turn[room]
                  
                self.game_over(room, message, mode, sids)
                break
            

            
            
        
    
            