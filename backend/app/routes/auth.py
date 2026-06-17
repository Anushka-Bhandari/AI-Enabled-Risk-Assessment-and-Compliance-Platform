import flask
from flask import request
from flask_jwt_extended import create_access_token

from flask import Blueprint , request, jsonify
from werkzeug.security import generate_password_hash , check_password_hash

from app.database import db
from app.models import User


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
    
    if not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401
    
    token = create_access_token(
        identity=user.id
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
    institute = data.get("institute")

    if not email:
        return jsonify({"error": "email is required"}), 400

    if '@' not in email:
        return jsonify({"error": "@ is required"}), 400

    if not name:
        return jsonify({"error": "name is required"}), 400

    if not password or len(password) < 6:
        return jsonify({"error": "password must be at least 6 characters"}), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
        institute=institute
    )

    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(
    identity=new_user.id
)

    return jsonify({
        "message": "User registered successfully",
        "token": token
    }), 201
