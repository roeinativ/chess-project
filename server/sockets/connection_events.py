from flask import request
from flask_socketio import leave_room
from models.users import Users

class ConnectionEvents():
    
    def __init__(self, socketio, room_manager, signed_in_clients):
        self.socketio = socketio
        self.room_manager = room_manager
        self.signed_in_clients = signed_in_clients
        self.connection_events()
        
    def connection_events(self):
        
        
        @self.socketio.on("connect")
        def handle_connect():
            sid = request.sid
            print(f"client connected {sid}")

        @self.socketio.on("update_connection")
        def handle_update_connection(data):
            new_sid = request.sid
            username = data.get("username")

            self.signed_in_clients.update_user(username, new_sid)

        @self.socketio.on("sign_in")
        def handle_sign_in(data):
            username = data.get("username")
            sid = request.sid

            user = Users.query.filter_by(name=username).first()
            user_id = user.id

            self.signed_in_clients.add_user(sid, user_id)

        @self.socketio.on("sign_out")
        def handle_sign_out():
            sid = request.sid
            self.signed_in_clients.remove_user(sid)

        @self.socketio.on("disconnect")
        def handle_disconnect():
            sid = request.sid
            self.room_manager.remove_from_room(sid)
            self.room_manager.remove_from_home(sid)
            leave_room(sid)
            print("Removed client from current room")