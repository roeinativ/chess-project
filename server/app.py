from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO
from flask import jsonify
from room_manager import RoomManager
from board_manager import BoardManager
from socket_events import SocketEvents
from users import Users,db 
import logging


log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


room_manager = RoomManager()
board_manager = BoardManager(1)
socket_events = SocketEvents(socketio, room_manager,board_manager)  

@app.route("/signUp", methods=["POST"])
def user():    
    data = request.get_json()
    print(data)
    username = data["username"]
    
    found_user = Users.query.filter_by(name=username).first()
    
    if found_user:
        print(f"User {username} already exists")
        return jsonify({"message": "User already exists"}, 400)
    
    else:
        new_user = Users(username)
        
        db.session.add(new_user)
        db.session.commit()
        print(f"Added user: {username}")
        
        users = Users.query.all()
        for user in users:
            print(user.id)
            print(user.name)
    
        return jsonify({"message": f"Added new user {username}"}, 200)


    
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