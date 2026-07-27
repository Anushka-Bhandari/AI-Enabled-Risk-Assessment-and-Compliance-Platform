from app.database import db
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    university_id = db.Column(
        db.Integer,
        db.ForeignKey("university.id"),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        nullable=False,
        default="user"
    )

    is_verified = db.Column(
        db.Boolean,
        default=False
    )

    otp = db.Column(
        db.String(6),
        nullable=True
    )

    otp_expiry = db.Column(
        db.DateTime,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp()
    )

    assessments = db.relationship(
        "Assessment",
        backref="user",
        lazy=True
    )


class University(db.Model):
    __tablename__ = "university"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    university_name = db.Column(
        db.String(500),
        nullable=False
    )

    email_domain = db.Column(
        db.String(100),
        nullable=True
    )

    assessments = db.relationship(
        "Assessment",
        backref="university",
        lazy=True
    )

    documents = db.relationship(
        "Document",
        backref="university",
        lazy=True
    )

    users = db.relationship(
        "User",
        backref="university",
        lazy=True
    )


class Assessment(db.Model):
    __tablename__ = "assessments"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    university_id = db.Column(
        db.Integer,
        db.ForeignKey("university.id"),
        nullable=False
    )

    risk_level = db.Column(
        db.String(20),
        nullable=True
    )

    compliance_score = db.Column(
        db.Float,
        nullable=True
    )

    status = db.Column(
        db.String(20),
        default="Pending"
    )

    questionnaire_completed = db.Column(
    db.Boolean,
    default=False
)

    document_completed = db.Column(
        db.Boolean,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp()
    )

    assessment_mode = db.Column(db.String(20), nullable=False)

    overall_risk_score = db.Column(
        db.Float,
        nullable=True
    )

    answers = db.relationship(
        "AssessmentAnswer",
        backref="assessment",
        lazy=True
    )

    documents = db.relationship(
        "Document",
        secondary="assessment_documents",
        back_populates="assessments"
    )

    compliance_results = db.relationship(
        "ComplianceResult",
        back_populates="assessment",
        lazy=True,
        cascade="all, delete-orphan"
    )

    control_risk_results = db.relationship(
        "ControlRiskResult",
        back_populates="assessment",
        lazy=True,
        cascade="all, delete-orphan"
    )

    category_risk_results = db.relationship(
        "CategoryRiskResult",
        back_populates="assessment",
        lazy=True,
        cascade="all, delete-orphan"
    )


class AssessmentAnswer(db.Model):
    __tablename__ = "assessment_answers"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id"),
        nullable=False
    )

    question_id = db.Column(
        db.String(20),
        nullable=False
    )

    answer = db.Column(db.String(30), nullable=False)


class Document(db.Model):
    __tablename__ = "documents"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    university_id = db.Column(db.Integer, db.ForeignKey("university.id"), nullable=False)

    original_filename = db.Column(
        db.String(255),
        nullable=False
    )

    stored_filename = db.Column(
        db.String(255),
        nullable=False
    )

    extracted_text = db.Column(
        db.Text,
        nullable=False
    )

    source = db.Column(
        db.String(20),
        nullable=False
    )

    uploaded_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp()
    )

    assessments = db.relationship(
        "Assessment",
        secondary="assessment_documents",
        back_populates="documents"
    )

class AssessmentDocument(db.Model):
    __tablename__ = "assessment_documents"

    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id"),
        primary_key=True
    )

    document_id = db.Column(
        db.Integer,
        db.ForeignKey("documents.id"),
        primary_key=True
    )

class ComplianceResult(db.Model):
    __tablename__ = "compliance_results"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id"),
        nullable=False
    )

    control_id = db.Column(
        db.String(4),
        nullable=False
    )

    compliance_status = db.Column(
        db.String(30),
        nullable=False
    )

    assessment = db.relationship(
        "Assessment",
        back_populates="compliance_results"
    )

    confidence = db.Column(
        db.Float,
        nullable=True
    )

    evidence = db.Column(
        db.Text,
        nullable=True
    )

class ControlRiskResult(db.Model):
    __tablename__ = "control_risk_results"

    __table_args__ = (
        db.UniqueConstraint(
            "assessment_id",
            "control_id",
            name="uq_control_risk_results"
        ),
    )

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id"),
        nullable=False
    )

    control_id = db.Column(
        db.String(4),
        nullable=False
    )

    risk_score = db.Column(
        db.Float,
        nullable=False
    )

    risk_level = db.Column(
        db.String(20),
        nullable=False
    )

    assessment = db.relationship(
        "Assessment",
        back_populates="control_risk_results"
    )

class CategoryRiskResult(db.Model):
    __tablename__ = "category_risk_results"

    __table_args__ = (
        db.UniqueConstraint(
            "assessment_id",
            "category",
            name="uq_category_risk_results"
        ),
    )

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id"),
        nullable=False
    )

    category = db.Column(
        db.String(100),
        nullable=False
    )

    risk_score = db.Column(
        db.Float,
        nullable=False
    )

    risk_level = db.Column(
        db.String(20),
        nullable=False
    )

    assessment = db.relationship(
        "Assessment",
        back_populates="category_risk_results"
    )

class Recommendation(db.Model):
    __tablename__ = "recommendations"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id"),
        nullable=False,
        index=True
    )

    control_id = db.Column(
        db.String(4),
        nullable=False
    )

    control_name = db.Column(
        db.String(255),
        nullable=False
    )

    priority = db.Column(
        db.String(20),
        nullable=False
    )

    estimated_effort = db.Column(
        db.String(50),
        nullable=False
    )

    implementation_timeline = db.Column(
        db.String(100),
        nullable=False
    )

    implementation_cost = db.Column(
        db.String(100),
        nullable=False
    )

    root_cause = db.Column(
        db.Text,
        nullable=False
    )

    recommendation = db.Column(
        db.Text,
        nullable=False
    )

    technical_steps = db.Column(
        db.JSON,
        nullable=False
    )

    policy_steps = db.Column(
        db.JSON,
        nullable=False
    )

    business_impact = db.Column(
        db.Text,
        nullable=False
    )

    success_metrics = db.Column(
        db.JSON,
        nullable=False
    )

    reference = db.Column(
        db.JSON,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp()
    )

    assessment = db.relationship(
        "Assessment",
        backref=db.backref(
            "recommendations",
            lazy=True,
            cascade="all, delete-orphan"
        )
    )

class ActivityLog(db.Model):
    __tablename__ = "activity_logs"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    event_id = db.Column(
        db.String(100),
        unique=True,
        nullable=False,
        index=True
    )

    user_name = db.Column(
        db.String(100),
        nullable=False
    )

    user_email = db.Column(
        db.String(120),
        nullable=False,
        index=True
    )

    role = db.Column(
        db.String(50),
        nullable=False
    )

    department = db.Column(
        db.String(100),
        nullable=False
    )

    timestamp = db.Column(
        db.DateTime,
        nullable=False
    )

    event_type = db.Column(
        db.String(100),
        nullable=False,
        index=True
    )

    event_name = db.Column(
        db.String(150),
        nullable=False
    )

    resource = db.Column(
        db.String(255),
        nullable=False
    )

    ip_address = db.Column(
        db.String(50),
        nullable=False,
        index=True
    )

    device = db.Column(
        db.String(255),
        nullable=False
    )

    location = db.Column(
        db.String(255),
        nullable=False
    )

    status = db.Column(
        db.String(50),
        nullable=False
    )

    event_metadata = db.Column(
        db.JSON,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        nullable=False
    )


class Alert(db.Model):
    __tablename__ = "alerts"

    id = db.Column(db.Integer, primary_key=True)

    event_id = db.Column(
        db.String(100),
        nullable=False,
        index=True
    )

    rule_id = db.Column(
        db.String(20),
        nullable=False
    )

    title = db.Column(
        db.String(255),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    severity = db.Column(
        db.String(20),
        nullable=False,
        index=True
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="OPEN",
        index=True
    )

    assigned_role = db.Column(
        db.String(50),
        nullable=False,
        default="SECURITY_OFFICER"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    resolved_at = db.Column(
        db.DateTime,
        nullable=True
    )