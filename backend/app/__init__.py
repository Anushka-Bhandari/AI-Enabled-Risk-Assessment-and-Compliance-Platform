import flask

from flask_cors import CORS
from app.config import Config
from app.database import db

from app.extensions import mail, jwt, migrate


def create_app():
    app = flask.Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    mail.init_app(app)      # ✅ ADD THIS
    jwt.init_app(app)
    migrate.init_app(app, db)

    from app.routes.auth import auth
    from app.routes.assessment import assessment
    from app.routes.dashboard import dashboard
    from app.routes.documents import documents

    app.register_blueprint(auth)
    app.register_blueprint(assessment)
    app.register_blueprint(dashboard)
    app.register_blueprint(documents)

    with app.app_context():
        db.create_all()

    return app