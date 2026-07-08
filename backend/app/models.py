from app.database import db


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