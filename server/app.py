from flask import Flask
from flask_socketio import SocketIO
from room_manager import RoomManager
from board_manager import BoardManager
from socket_events import SocketEvents
import logging

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
room_manager = RoomManager()
board_manager = BoardManager(1)
socket_events = SocketEvents(socketio, room_manager,board_manager)  


    
if __name__ == "__main__":
    socketio.run(
        app=app,
        host="0.0.0.0",
        port=5555,
        debug=True,
        use_reloader=False,
        log_output=False,
    )