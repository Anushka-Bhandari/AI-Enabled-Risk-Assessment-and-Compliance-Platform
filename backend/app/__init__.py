import flask

from flask_cors import CORS
from app.config import Config
from app.database import db

from app.extensions import mail, jwt, migrate , socketio
from app.routes.alerts import alerts_bp

def create_app():
    app = flask.Flask(__name__)

    app.config.from_object(Config)

    print("=" * 80)
    print(app.config["SQLALCHEMY_DATABASE_URI"])
    print("=" * 80)

    Config.create_report_directories()

    CORS(app)

    db.init_app(app)
    mail.init_app(app)      # ✅ ADD THIS
    jwt.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(
    app,
    cors_allowed_origins="*"
)

    from app.routes.auth import auth
    from app.routes.assessment import assessment
    from app.routes.dashboard import dashboard
    from app.routes.documents import documents
    from app.routes.run_assessment import run_assessment
    from app.routes.questionnaire import questionnaire_bp
    from app.routes.compliance_results import compliance_results
    from app.routes.risk_results import risk_results
    from app.routes.summary_results import summary_results
    from app.routes.report import report_bp
    from app.routes.recommendations import recommendation_bp
    from app.routes.frameworks import framework_bp
    from app.routes.events import events
    from app.routes.threat_analysis import threat_analysis_bp
    from app.routes.activity_logs import activity_logs_bp


    app.register_blueprint(auth)
    app.register_blueprint(assessment)
    app.register_blueprint(dashboard)
    app.register_blueprint(documents)
    app.register_blueprint(run_assessment)
    app.register_blueprint(questionnaire_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(activity_logs_bp)
    app.register_blueprint(recommendation_bp)
    app.register_blueprint(framework_bp)
    app.register_blueprint(events,url_prefix="/api")
    app.register_blueprint(alerts_bp, url_prefix="/alerts")
    app.register_blueprint(threat_analysis_bp, url_prefix="/threat-analysis")

    app.register_blueprint(
        compliance_results
    )

    app.register_blueprint(
        risk_results
    )

    app.register_blueprint(
        summary_results
    )

    return app