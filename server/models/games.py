from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()

class GameHistory(db.Model):
    id = db.Column(db.String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    white_player_id = db.Column(db.String(100), db.ForeignKey('users.id'))
    black_player_id = db.Column(db.String(100), db.ForeignKey('users.id'))
    
    history = db.Column(db.JSON, default=[])
    
    def __init__(self, white_player_id, black_player_id, history):
        self.white_player_id = white_player_id
        self.black_player_id = black_player_id
        self.history = history
        
    def add_move(self, move, player_color):
        self.history.append({"move": move, "player_color": player_color})
        
        