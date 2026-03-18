from models.extensions import db
import uuid

class GameHistory(db.Model):
    id = db.Column(db.String(100), primary_key=True, default=lambda: str(uuid.uuid4()))

    first_username = db.Column(db.String(100), db.ForeignKey("users.name"))
    second_username = db.Column(db.String(100), db.ForeignKey("users.name"))
    winner = db.Column(db.String(100))

    history = db.Column(db.JSON, default=[])

    def __init__(self, first_username,second_username, winner ,history):
        self.first_username = first_username
        self.second_username = second_username
        self.winner = winner
        self.history = history
        
    def __repr__(self):
        return f"first: {self.first_username}, second: {self.second_username}, history: {self.history}"

    def to_dict(self):
        return {
            "first_username": self.first_username,
            "second_username": self.second_username,
            "winner": self.winner,
            "history": self.history
        }