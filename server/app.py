from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from managers.room_manager import RoomManager
from managers.board_manager import BoardManager
from sockets.socket_events import SocketEvents
from managers.signed_in_clients import SignedInClients
from routes.route import Routes
from models.users import db
from engines.chess_engine import ChessEngine
import logging


log = logging.getLogger("werkzeug")
log.setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///site.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

chess_engine = ChessEngine()
signed_in_clients = SignedInClients()
room_manager = RoomManager()
board_manager = BoardManager(1)
socket_events = SocketEvents(
    socketio, room_manager, board_manager, signed_in_clients, chess_engine, app
)
routes = Routes(app, signed_in_clients)


if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    socketio.run(
        app=app,
        host="0.0.0.0",
        port=5555,
        debug=True,
        use_reloader=False,
        log_output=False,
    )
