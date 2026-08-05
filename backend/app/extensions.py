from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_socketio import SocketIO


mail = Mail()

jwt = JWTManager()

migrate = Migrate()

socketio = SocketIO(
    cors_allowed_origins="*"
)