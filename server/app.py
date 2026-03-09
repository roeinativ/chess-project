from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO
from flask import jsonify
from room_manager import RoomManager
from board_manager import BoardManager
from socket_events import SocketEvents
from signed_in_clients import SignedInClients
from users import Users, db
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


@app.route("/signUp", methods=["POST"])
def sign_up():
    data = request.get_json()
    print(data)
    username = data["username"]
    sid = data["sid"]

    found_user = Users.query.filter_by(name=username).first()

    if found_user:
        print(f"User {username} already exists")
        return jsonify({"message": "User already exists"}, 400)

    new_user = Users(name=username)

    db.session.add(new_user)
    db.session.commit()

    user = Users.query.filter_by(name=username).first()
    user_id = user.id
    signed_in_clients.add_user(sid, user_id)

    print(f"Added user: {username}")

    return jsonify({"message": f"Added new user {username}", "username": username}, 200)


@app.route("/signIn", methods=["POST"])
def sign_in():
    data = request.get_json()
    print(f"Data: {data}")

    username = data["username"]
    sid = data["sid"]

    found_user = Users.query.filter_by(name=username).first()

    if not found_user:
        print("User does not exist")
        return jsonify({"message": "User does not exist"}, 400)

    user = Users.query.filter_by(name=username).first()
    user_id = user.id

    signed_in_clients.add_user(sid, user_id)
    print(f"User logged in: {username}")
    return jsonify({"username": username}, 200)


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
