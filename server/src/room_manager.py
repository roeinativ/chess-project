class RoomManager:
    def __init__(self):
        self.home = "Home"
        self.home_users = []
        self.rooms = {}
        self.current_room = 1
        self.MAX_PLAYERS_IN_ROOM = 2
        
    def get_home(self):
        return self.home
        
    def get_home_users(self):
        return self.home_users
    
    def get_rooms(self):
        return self.rooms
    
    def add_to_game_room(self,username):
        self.home_users.remove(username)
        self.rooms[self.current_room].append(username)
    
    def add_to_home(self,username):
        self.home_users.append(username)
        
    def find_room(self):
        if self.current_room not in self.rooms:
            self.rooms[self.current_room] = []
            return self.current_room
        
        if len(self.rooms[self.current_room]) < self.MAX_PLAYERS_IN_ROOM:
            return self.rooms[self.current_room]
        
        self.current_room += 1
        self.rooms[self.current_room] = []
        return self.rooms[self.current_room]