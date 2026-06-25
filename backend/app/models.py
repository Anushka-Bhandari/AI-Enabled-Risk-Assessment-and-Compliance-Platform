from app.database import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    institute = db.Column(db.String(120), nullable=False)

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


class Assessment(db.Model):
    __tablename__ = "assessments"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    assessment_name = db.Column(
        db.String(200),
        nullable=False
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

    answers = db.relationship(
        "AssessmentAnswer",
        backref="assessment",
        lazy=True
    )

    documents = db.relationship(
        "Document",
        backref="assessment",
        lazy=True
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

    answer = db.Column(
        db.Boolean,
        nullable=False
    )


class Document(db.Model):
    __tablename__ = "documents"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    university_id = db.Column(db.Integer, db.ForeignKey("university.id"), nullable=False)

    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id"),
        nullable=False
    )

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

    document_type = db.Column(
        db.String(100),
        nullable=True
    )

    source = db.Column(
        db.String(20),
        nullable=False
    )

    uploaded_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp()
    )