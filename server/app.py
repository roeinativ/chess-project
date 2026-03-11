from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from room_manager import RoomManager
from board_manager import BoardManager
from socket_events import SocketEvents
from signed_in_clients import SignedInClients
from routes import Routes
from users import db
import logging


log = logging.getLogger("werkzeug")
log.setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///site.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

signed_in_clients = SignedInClients()
room_manager = RoomManager()
board_manager = BoardManager(1)
socket_events = SocketEvents(socketio, room_manager, board_manager, signed_in_clients)
routes = Routes(app,signed_in_clients)



if __name__ == "__main__":

    with app.app_context():
        db.drop_all()
        db.create_all()

    socketio.run(
        app=app,
        host="0.0.0.0",
        port=5555,
        debug=True,
        use_reloader=False,
        log_output=False,
    )
