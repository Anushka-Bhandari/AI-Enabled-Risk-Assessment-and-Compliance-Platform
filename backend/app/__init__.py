import flask

from app.config import Config
from app.database import db

def create_app():
    app = flask.Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)

    from app.routes.auth import auth
    from app.routes.assessment import assessment
    from app.routes.dashboard import dashboard

    app.register_blueprint(auth)
    app.register_blueprint(assessment)
    app.register_blueprint(dashboard)

    return app
