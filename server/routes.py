from users import Users, db
from flask import request, jsonify

class Routes:
    
    def __init__(self,app,signed_in_clients):
        self.app = app
        self.signed_in_clients = signed_in_clients
        self.register()
    
    
    def register(self):
    
        @self.app.route("/signUp", methods=["POST"])
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
            self.signed_in_clients.add_user(sid, user_id)

            print(f"Added user: {username}")

            return jsonify({"message": f"Added new user {username}", "username": username}, 200)


        @self.app.route("/signIn", methods=["POST"])
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

            self.signed_in_clients.add_user(sid, user_id)
            print(f"User logged in: {username}")
            return jsonify({"username": username}, 200)