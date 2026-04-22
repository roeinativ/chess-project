from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from sockets.socket_events import SocketEvents
from managers.signed_in_clients import SignedInClients
from routes.route import Routes
from models.extensions import db
from engines.chess_engine import ChessEngine
from managers.game_manager import GameManager
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
game_manager = GameManager(signed_in_clients, socketio, chess_engine, app)

socket_events = SocketEvents(game_manager, socketio, signed_in_clients)

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
