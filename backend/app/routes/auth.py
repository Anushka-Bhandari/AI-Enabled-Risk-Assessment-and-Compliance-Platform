from flask_jwt_extended import create_access_token
from app.services.otp_services import generate_otp, get_expiry

from flask import Blueprint, config , request, jsonify
from werkzeug.security import generate_password_hash , check_password_hash

from app.database import db
from app.models import User, University

import random
from datetime import datetime, timedelta
from app.services.email_service import send_otp_email


#Blueprint is a Flask feature used to organize routes.
#Blueprint() is a constructor.  

#__name__  Flask uses this to locate files and templates.s

auth = Blueprint("auth", __name__)

#This is called a decorator. A decorator modifies a function.
@auth.route("/login", methods = ["POST"])
def login():

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404
    
    if not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401
    
    token = create_access_token(
    identity=str(user.id)
)

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user_id": user.id,
        "name": user.name
    }), 200

@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    university_id = data.get("university_id")

    if not name or not email or not password or not university_id:
        return jsonify({"error": "Missing fields"}), 400

    if '@' not in email:
        return jsonify({"error": "Invalid email"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password too short"}), 400

    university = University.query.get(university_id)
    if not university:
        return jsonify({"error": "Invalid university"}), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "error": "Email already registered"
        }), 409

    hashed_password = generate_password_hash(password)

    # 🔥 OTP generation
    otp = generate_otp()
    expiry = get_expiry()

    new_user = User(
        name=name,
        email=email,
        password_hash=hashed_password,
        university_id=university_id,
        otp=otp,
        otp_expiry=expiry,
        is_verified=False
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Server error"}), 500

    # 📩 send OTP email
    email_sent = send_otp_email(email, otp)

    if not email_sent:
        return jsonify({
            "error": "Failed to send OTP email"
        }), 500

    return jsonify({
        "message": "OTP sent to email. Please verify your account."
    }), 201

@auth.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()

    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.is_verified:
        return jsonify({"message": "Already verified"}), 400

    if user.otp != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    if not user.otp_expiry or datetime.utcnow() > user.otp_expiry:
        return jsonify({"error": "OTP expired"}), 400
    
    print("MAIL_USERNAME =", config.MAIL_USERNAME)
    print("MAIL_DEFAULT_SENDER =", config.MAIL_DEFAULT_SENDER)

    # ✅ verify user
    user.is_verified = True
    user.otp = None
    user.otp_expiry = None

    db.session.commit()

    # 🔐 generate token AFTER verification
    token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Email verified successfully",
        "token": token
    }), 200

@auth.route("/resend-otp", methods=["POST"])
def resend_otp():
    data = request.get_json()
    email = data.get("email")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.is_verified:
        return jsonify({"message": "Already verified"}), 400

    # ✅ cooldown check BEFORE generating OTP
    if user.otp_expiry and (datetime.utcnow() - (user.otp_expiry - timedelta(minutes=10))).seconds < 60:
        return jsonify({"error": "Please wait before requesting another OTP"}), 429

    otp = generate_otp()
    user.otp = otp
    user.otp_expiry = get_expiry()

    db.session.commit()

    send_otp_email(email, otp)

    return jsonify({"message": "OTP resent successfully"}), 200

@auth.route('/universities', methods=['GET'])
def get_universities():
    universities = University.query.order_by(University.university_name).all()

    return jsonify([
        {
            "id": u.id,
            "name": u.university_name
        }
        for u in universities
    ])

@auth.route("/universities/search")
def search_universities():
    query = request.args.get("q", "").strip()

    if len(query) < 2:
        return jsonify([])

    universities = (
        University.query
        .filter(
            University.university_name.ilike(f"{query}%")
        )
        .limit(20)
        .all()
    )

    return jsonify([
        {
            "id": u.id,
            "university_name": u.university_name
        }
        for u in universities
    ])