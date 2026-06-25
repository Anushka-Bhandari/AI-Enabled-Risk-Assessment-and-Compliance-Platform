from flask import Blueprint, request, jsonify

from app.database import db
from app.models import Assessment, AssessmentAnswer

from sqlalchemy.exc import IntegrityError

assessment = Blueprint("assessment", __name__)


@assessment.route("/assessment", methods=["POST"])
def submit_assessment():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data provided"
        }), 400

    if "university_id" not in data:
        return jsonify({
            "error": "university_id is required"
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

    # TODO: Replace with authenticated user's ID after JWT authentication
    current_user_id = 1

    assessment_record = Assessment(
        user_id=current_user_id,
        university_id=data["university_id"]
    )

    try :
        db.session.add(assessment_record)
        db.session.flush()

        for question_id, answer in answers.items():
            answer_record = AssessmentAnswer(
                assessment_id=assessment_record.id,
                question_id=question_id,
                answer=answer
            )
            db.session.add(answer_record)

        db.session.commit()

    except IntegrityError as e:
        db.session.rollback()
        print(e)
        return jsonify({
            "error": "Database integrity error."
        }), 400

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({
            "error": "Unable to save assessment."
        }), 500

    return jsonify({
        "message": "Assessment stored successfully",
        "assessment_id": assessment_record.id
    }), 201