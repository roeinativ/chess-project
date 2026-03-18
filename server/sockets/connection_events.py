from flask import request
from flask_socketio import leave_room
from models.users import Users

class ConnectionEvents():
    
    def __init__(self, context):
        self.context = context
        self.connection_events()
        
    def connection_events(self):
        
        
        @self.context.socketio.on("connect")
        def handle_connect():
            sid = request.sid
            print(f"client connected {sid}")

        @self.context.socketio.on("update_connection")
        def handle_update_connection(data):
            new_sid = request.sid
            username = data.get("username")

            self.context.signed_in_clients.update_user(username, new_sid)

        @self.context.socketio.on("sign_in")
        def handle_sign_in(data):
            username = data.get("username")
            sid = request.sid

            user = Users.query.filter_by(name=username).first()
            user_id = user.id

            self.context.signed_in_clients.add_user(sid, user_id)

        @self.context.socketio.on("sign_out")
        def handle_sign_out():
            sid = request.sid
            self.context.signed_in_clients.remove_user(sid)

        @self.context.socketio.on("disconnect")
        def handle_disconnect():
            sid = request.sid
            self.context.room_manager.remove_from_room(sid)
            self.context.room_manager.remove_from_home(sid)
            leave_room(sid)
            print("Removed client from current room")