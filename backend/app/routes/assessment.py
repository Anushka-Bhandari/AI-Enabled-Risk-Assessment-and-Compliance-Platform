from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import db
from sqlalchemy.exc import IntegrityError
from app.models import Assessment, AssessmentAnswer, User

assessment = Blueprint("assessment", __name__)


@assessment.route("/assessment", methods=["POST"])
@jwt_required()
def submit_assessment():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data provided"
        }), 400

    if "answers" not in data:
        return jsonify({
            "error": "answers are required"
        }), 400

    answers = data["answers"]

    if not isinstance(answers, dict):
        return jsonify({
            "error": "answers must be a dictionary"
        }), 400

    for question_id, answer in answers.items():

        if not isinstance(answer, bool):
            return jsonify({
                "error": f"{question_id} must be true or false"
            }), 400

    current_user_id = get_jwt_identity()
    current_user = db.session.get(User, current_user_id)

    if not current_user:
        return jsonify({
            "error": "User not found."
        }), 404

    assessment = Assessment(
        user_id=current_user.id,
        university_id=current_user.university_id
    )


    try:
        db.session.add(assessment)
        db.session.flush()

        for question_id, answer in answers.items():
            answer_record = AssessmentAnswer(
                assessment_id=assessment.id,
                question_id=question_id,
                answer=answer
            )
            db.session.add(answer_record)

        db.session.commit()

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "error": "Database integrity error."
        }), 400

    except Exception:
        db.session.rollback()
        return jsonify({
            "error": "Unable to save assessment."
        }), 500

    return jsonify({
        "message": "Assessment stored successfully",
        "assessment_id": assessment.id
    }), 201