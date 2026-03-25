from managers.room_manager import Room

class GameManager:
    def __init__(self,signed_in_clients,socketio,stockfish,app):
        
        self.socketio = socketio
        self.stockfish = stockfish
        self.app = app
        
        self.rooms = {}
        self.player_room = {}
        self.waiting_players = []
        
        self.signed_in_clients = signed_in_clients
        
        self.color_list = ["white","black"]
        self.room_id = 0
        self.MAX_PLAYERS_PVP = 2
        self.MAX_PLAYERS_PVE = 1
        self.HOME = "home"
        

    def get_room(self, room):
        return self.rooms[room]

    def add_to_waiting_room(self, sid):
        self.waiting_players.append(sid)

    def remove_from_waiting_room(self, sid):
        self.waiting_players.remove(sid)
        
    def remove_from_room(self,room_id,sid):
        self.player_room[room_id].remove(sid)
        
    def create_room(self,mode):
        self.rooms[self.room_id] = Room(
            self.room_id, mode, self.stockfish, self.signed_in_clients , self.app
        )


    def find_room(self, sid, mode):
        
        # Try to reuse an existing room
        for room_id, room in self.rooms.items():
            if not room.is_room_full() and room.available and mode == room.mode:  
                
                room.add_player(sid)
                
                if room_id not in self.player_room:
                    self.player_room[room_id] = []
                    
                self.player_room[room_id].append(sid)
                self.waiting_players.remove(sid)

                print(f"Player added players: {room.players}")
                return room_id

        # No available room create new one
        self.room_id += 1
        self.create_room(mode)

        self.rooms[self.room_id].add_player(sid)
        self.player_room[self.room_id] = [sid]

        self.waiting_players.remove(sid)

        print(f"Player added players: {self.rooms[self.room_id].players}")

        return self.room_id

    def end_game(self, room):

        players = self.player_room[room].copy()

        self.rooms[room].exit_room()

        self.rooms[room].reset_room()

        
        self.player_room[room].clear()

        self.waiting_players.extend(players)
        
        for player_sid in players:
            self.socketio.server.leave_room(player_sid,room)
            self.socketio.server.enter_room(player_sid, self.HOME)
            
        print(f"Game Ended \n Home: {self.waiting_players}")
        
        