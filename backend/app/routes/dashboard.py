from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

dashboard = Blueprint("dashboard", __name__)

@dashboard.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard_page():

    user_id = get_jwt_identity()

    return jsonify({
        "message": "Dashboard display",
        "user_id": user_id
    }), 200