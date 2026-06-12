from app import create_app
from app.database import db
from app.models import User

app = create_app()

with app.app_context():
    db.create_all()
    print("Tables Created Successfully")