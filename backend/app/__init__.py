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
<<<<<<< HEAD
=======
    from app.routes.run_assessment import run_assessment
    # from app.routes.prediction import prediction
    # from app.routes.compliance import compliance
>>>>>>> bae88ec129e37ec0a4acd154390423b4120f1f2c

    app.register_blueprint(auth)
    app.register_blueprint(assessment)
    app.register_blueprint(dashboard)
    app.register_blueprint(documents)
<<<<<<< HEAD
=======
    app.register_blueprint(run_assessment)
    # app.register_blueprint(prediction)
    # app.register_blueprint(compliance)
>>>>>>> bae88ec129e37ec0a4acd154390423b4120f1f2c

    return app