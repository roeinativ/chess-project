from flask_socketio import emit, join_room, leave_room

class SocketEvents:
    def __init__(self,socketio, room_manager):
        self.socketio = socketio
        self.room_manager = room_manager
        self.home = room_manager.get_home()
        self.register()
        
    def register(self):
        
        @self.socketio.on("connect")
        def handle_connect():
            print("client connected")
            
        @self.socketio.on("join_home")
        def handle_join(data):
            self.home = self.room_manager.get_home()
            username = data.get("username")
            sid = data.get("sid")
            
            join_room(self.home)
            self.room_manager.add_to_home(sid)
            print(f"Home users: {self.room_manager.get_home_users()}")
            
            emit("join_home", {"username":username, "room":self.home}, to=sid)
            print(f"Sending to {sid} join home emit")
            
        @self.socketio.on("join_game")
        def handle_join_game(data):
            start_game = False
            
            username = data.get("username")
            room = data.get("room")
            sid = data.get("sid")
            
            leave_room(room)
            game_room = self.room_manager.find_room()
            if self.room_manager.add_to_game_room(sid):
                start_game = True
                
            join_room(game_room)
            self.socketio.sleep(0.1)
            
            emit("join_game", {"username":username, "room":game_room}, to=sid)
            print(f"{username} is being added to room {game_room}")
            print(f"Home users: {self.room_manager.get_home_users()}\n Game rooms: {self.room_manager.get_rooms()}")
            
            if start_game:
                emit("start_game", {"username": username, "room": game_room}, to=game_room)
                    
                print(f"Room number: {game_room}, start the game")
            
        @self.socketio.on("cancel_matchmaking")
        def handle_cancel_matchmaking(data):
            room = data.get("room")
            sid = data.get("sid")
            
            # Leave the current room
            self.room_manager.remove_from_room(sid)
            leave_room(room)
            
            self.home = self.room_manager.get_home()  
            
            # Join home
            self.room_manager.add_to_home(sid)
            join_room(self.home)
            
            emit("join_home", {"username": sid, "room": self.home}, to=sid)
            print(f"{sid} canceld matchmaking and is now joining home")
            print(f"Home users: {self.room_manager.get_home_users()}")
            
            
            
            