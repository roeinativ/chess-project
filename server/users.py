from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100))
    
    def __init__(self, name):
        self.name = name
        
    