from users import Users

class SignedInClients():
    def __init__(self):
        self.signed_in_clients = {}
        
        
    def add_user(self,sid,user_id):
        self.signed_in_clients[sid] = user_id
        print(f"Connected clients: {self.signed_in_clients}")
    
    def update_user(self,username,new_sid):
        current_user = Users.query.filter_by(name=username).first()
        user_id = current_user.id
        
        for sid, id in self.signed_in_clients.items():
            if id == user_id:
                prev_sid = sid

        val = self.signed_in_clients.pop(prev_sid)
        self.signed_in_clients[new_sid] = val
        print(f"Connected clients: {self.signed_in_clients}")