import flask

from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.config import Config
from app.database import db

jwt = JWTManager()


def create_app():
    app = flask.Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    from app.routes.auth import auth
    from app.routes.assessment import assessment
    from app.routes.dashboard import dashboard

    app.register_blueprint(auth)
    app.register_blueprint(assessment)
    app.register_blueprint(dashboard)

    with app.app_context():
        db.create_all()

    return app