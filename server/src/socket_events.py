from flask_socketio import emit, join_room, leave_room

class SocketEvents:
    def __init__(self,socketio, room_manager):
        self.socketio = socketio
        self.room_manager = room_manager
        self.register()
        
    def register(self):
        @self.socketio.on("connect")
        def handle_connect(self):
            print("client connected")
            
        @self.socketio.on("join_home")
        def handle_join(data,self):
            home = self.room_manager.get_home()
            username = data.get("username")
            sid = data.get("sid")
            
            join_room(home)
            self.room_manager.add_to_home(username)
            print(f"Home users: {self.room_manager.get_home_users()}")
            
            emit("join_home", {"username":username, "room":home}, to=sid)
            print(f"{username} has connected and is joining to {home}")
            
        @self.socketio.on("join_game")
        def handle_join_game(data,self):
            username = data.get("username")
            room = data.get("room")
            sid = data.get("sid")
            
            leave_room(room)
            game_room = self.room_manager.find_room()
            self.room_manager.add_to_game_room(username)
            join_room(game_room)
            
            emit("join_game", {"username":username, "room":game_room}, to=sid)
            print(f"{username} is being added to room {game_room}")
            print(f"Home users: {self.room_manager.get_home_users()}\n Game rooms: {self.room_manager.get_rooms()}")
            
        
            