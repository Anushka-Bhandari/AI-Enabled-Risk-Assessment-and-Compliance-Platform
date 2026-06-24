import flask

from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from app.config import Config
from app.database import db

jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = flask.Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from app.routes.auth import auth
    from app.routes.assessment import assessment
    from app.routes.dashboard import dashboard
    from app.routes.documents import documents
    # from app.routes.prediction import prediction
    # from app.routes.compliance import compliance

    app.register_blueprint(auth)
    app.register_blueprint(assessment)
    app.register_blueprint(dashboard)
    app.register_blueprint(documents)
    # app.register_blueprint(prediction)
    # app.register_blueprint(compliance)

    with app.app_context():
        db.create_all()

    return app