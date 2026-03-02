from flask import Flask
from flask_socketio import SocketIO
from room_manager import RoomManager
from socket_events import SocketEvents

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
socketio.init_app(app)
room_manager = RoomManager()
socket_events = SocketEvents(socketio,room_manager)


    
if __name__ == "__main__":
    socketio.run(
        app=app, 
        host="0.0.0.0", 
        port=5555,
        debug=True,
        use_reloader=True)