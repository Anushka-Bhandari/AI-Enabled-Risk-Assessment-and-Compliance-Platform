from app.database import db

class User(db.Model): #creates a User table in the database
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    institute = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="user")
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class Assessment(db.Model): #creates an Assessment table in the database
    __tablename__ = 'assessments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    university_id = db.Column(db.Integer, db.ForeignKey('university.id'), nullable = False)
    created_at = db.Column(db.DateTime, default = db.func.current_timestamp())

class University(db.Model):
    __tablename__ = 'university'

    id = db.Column(db.Integer, primary_key=True)
    university_name = db.Column(db.String(500), nullable=False)

class AssessmentAnswer(db.Model):
    __tablename__ = 'assessment_answers'
    id = db.Column(db.Integer, primary_key= True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id'), nullable=False)
    question_id = db.Column(db.String(20), nullable=False)
    answer = db.Column(db.Boolean, nullable=False)