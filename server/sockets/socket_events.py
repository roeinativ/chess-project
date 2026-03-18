from flask_socketio import join_room, leave_room
from models.games import GameHistory, db
from .matchmaking_events import MatchmakingEvents
from .game_loop_events import GameLoopEvents
from .connection_events import ConnectionEvents
from contexts.game_state import GameState
from contexts.game_context import GameContext


class SocketEvents:
    def __init__(self, socketio, room_manager, board_manager, signed_in_clients, stockfish, app):
        self.context = GameContext(socketio,room_manager,board_manager,signed_in_clients,stockfish)
        self.starting_time = 300000000
        self.state = GameState()
        self.app = app
        self.socket_events()
        

    def socket_events(self):

        MatchmakingEvents(
            self.starting_time,
            self.context,
            self.state,
            self.count_time,
        )

        GameLoopEvents(
            self.context,
            self.state,
            self.set_fen,
            self.game_over
        )
        
        ConnectionEvents(
            self.context
        )
    

    def leave_game(self, room):
        sid_list = self.context.room_manager.get_room_sids(room)
        sid_list_copy = list(sid_list)

        for player_sid in sid_list_copy:

            self.context.room_manager.remove_from_room(player_sid)
            self.context.socketio.server.leave_room(player_sid,room)

            self.context.room_manager.add_to_home(player_sid)
            self.context.socketio.server.enter_room(player_sid, self.context.home)
            
        print(f"Home users {self.context.room_manager.get_home_users()}")
        
        
    def game_over(self,room,message, mode, winner=None ,sids=None):
        self.context.socketio.emit("game_over", {"message": message, "fen": self.state.current_fen[room]}, to=room)

        with self.app.app_context():
            if mode == "PVP":
                
                for i in range(len(sids)):
                    player_sid = sids[i]
                    
                    if self.state.sid_color[player_sid] == "white":
                        first_player_sid = player_sid
                        
                    else:
                        second_player_sid = player_sid
                        
                    del self.state.sid_color[player_sid]
                                
                first_username = self.context.signed_in_clients.get_username(first_player_sid)
                second_username = self.context.signed_in_clients.get_username(second_player_sid)
                
                game_history = self.state.game_history[room]
                new_game_history = GameHistory(first_username,second_username, winner ,game_history)
                del self.state.game_history[room]
                
                db.session.add(new_game_history)
                db.session.commit()
                
                print(new_game_history)
                    
            self.leave_game(room)

    def count_time(self,room, mode):
        winner = "white"
        while room in self.state.players_time:
            self.context.socketio.sleep(1)
            current_player = self.state.current_turn[room]
            self.state.players_time[room][current_player] -= 1000

            if self.state.players_time[room][current_player] <= 0:

                winner_index = 1 - current_player
                if winner_index == 1:
                    winner = "black"
                
                message = f"Time run out winner is {winner}"
                    
                sids = self.context.room_manager.get_room_sids(room)  
                
                del self.state.players_time[room]
                del self.state.current_turn[room]
                  
                self.game_over(room, message, mode, sids)
                break
            
    def set_fen(self,room,fen):
        self.state.current_fen[room] = fen
            
        
    
            