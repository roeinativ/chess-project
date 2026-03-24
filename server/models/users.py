from models.extensions import db
import uuid

class Users(db.Model):
    id = db.Column(db.String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(20), nullable=False)
    
    def __init__(self, name, password):
        self.name = name
        self.password = password
        
