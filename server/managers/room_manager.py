class RoomManager:
    def __init__(self):
        self.home = "Home"
        self.home_users = []
        self.rooms = {}
        self.current_room = 1
        self.MAX_PLAYERS_IN_PVP_ROOM = 2
        self.MAX_PLAYERS_IN_PVE_ROOM = 1
        
    def get_home(self):
        return self.home
        
    def get_home_users(self):
        return self.home_users
    
    def get_rooms(self):
        return self.rooms
    
    def add_to_game_room(self,sid,mode):
        max_players = self.MAX_PLAYERS_IN_PVP_ROOM
        if mode == 'PVE':
            max_players = self.MAX_PLAYERS_IN_PVE_ROOM
        
        self.home_users.remove(sid)
        self.rooms[self.current_room].append(sid)

        if len(self.rooms[self.current_room]) == max_players:              
            return True

        return False
    
    def add_to_home(self,sid):
        self.home_users.append(sid)
        
    def remove_from_home(self,sid):
        if sid in self.home_users:
            self.home_users.remove(sid)
        
    def find_room(self,mode):
        max_players = self.MAX_PLAYERS_IN_PVP_ROOM
        if mode == 'PVE':
            max_players = self.MAX_PLAYERS_IN_PVE_ROOM
        
        if self.current_room not in self.rooms:
            self.rooms[self.current_room] = []
            return self.current_room
        
        elif len(self.rooms[self.current_room]) < max_players:
            return self.current_room
        
        self.current_room += 1
        self.rooms[self.current_room] = []
        return self.current_room
    
    def remove_from_room(self, sid):
        for room, users in self.rooms.items():
            if sid in users:
                users.remove(sid)
                return
            
    def get_room_sids(self,room):
        return self.rooms[room]
    
    def get_opponent_sid(self,room,sid):
        current_room = self.rooms[room]
        for player_sid in current_room:
            if player_sid != sid:
                return player_sid