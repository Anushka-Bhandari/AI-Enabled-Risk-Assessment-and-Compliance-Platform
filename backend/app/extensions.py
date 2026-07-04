from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

mail = Mail()
jwt = JWTManager()
migrate = Migrate()