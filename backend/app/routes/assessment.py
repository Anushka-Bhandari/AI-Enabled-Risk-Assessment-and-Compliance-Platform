import json
from pathlib import Path
from flask import Blueprint, app, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import db
from sqlalchemy.exc import IntegrityError
from app.models import Assessment, AssessmentAnswer, User
from werkzeug.utils import secure_filename
from app.models import (
    Assessment,
    AssessmentAnswer,
    ComplianceResult,
    User
)

assessment = Blueprint("assessment", __name__)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

QUESTIONNAIRE_PATH = os.path.join(
    BASE_DIR,
    "questionnaire.json"
)

with open(QUESTIONNAIRE_PATH, "r", encoding="utf-8") as file:
    questionnaire = json.load(file)
    
VALID_QUESTION_IDS = {
    str(question["id"])
    for question in questionnaire["questions"]
}

VALID_ANSWERS = {
    "Implemented",
    "Partially Implemented",
    "Not Implemented",
    "Not Applicable",
}

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


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

    if len(answers) != len(VALID_QUESTION_IDS):
        return jsonify({
            "error": "All questionnaire items must be answered."
        }), 400

    for question_id, answer in answers.items():
        if question_id not in VALID_QUESTION_IDS:
            return jsonify({
                "error": f"Invalid question ID: {question_id}"
            }), 400

        if answer not in VALID_ANSWERS:
            return jsonify({
                "error": f"Invalid answer for question {question_id}"
            }), 400

    current_user_id = get_jwt_identity()
    current_user = db.session.get(User, current_user_id)

    if not current_user:
        return jsonify({
            "error": "User not found."
        }), 404

    assessment = Assessment(
        user_id=current_user.id,
        university_id=current_user.university_id,
        assessment_mode="QUESTIONNAIRE",
        questionnaire_completed=True,
        status="Pending"
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

    except Exception as e:
        db.session.rollback()

        print("ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500

    return jsonify({
        "message": "Assessment stored successfully",
        "assessment_id": assessment.id
    }), 201

@assessment.route(
        "/assessment/<int:assessment_id>/result",
        methods=["GET"]
    )
@jwt_required()
def get_assessment_result(assessment_id):

    assessment = Assessment.query.get(assessment_id)

    if not assessment:
        return jsonify({
            "error": "Assessment not found"
        }), 404

    implemented_count = ComplianceResult.query.filter_by(
        assessment_id=assessment_id,
        compliance_status="IMPLEMENTED"
    ).count()

    partial_count = ComplianceResult.query.filter_by(
        assessment_id=assessment_id,
        compliance_status="PARTIALLY_IMPLEMENTED"
    ).count()

    not_implemented_count = ComplianceResult.query.filter_by(
        assessment_id=assessment_id,
        compliance_status="NOT_IMPLEMENTED"
    ).count()

    na_count = ComplianceResult.query.filter_by(
        assessment_id=assessment_id,
        compliance_status="NOT_APPLICABLE"
    ).count()

    return jsonify({
        "assessment_id": assessment.id,
        "status": assessment.status,
        "assessment_mode": assessment.assessment_mode,
        "risk_level": assessment.risk_level,
        "compliance_score": assessment.compliance_score,
        "questionnaire_completed":
            assessment.questionnaire_completed,

        "document_completed":
            assessment.document_completed,

        "implemented_count": implemented_count,
        "partial_count": partial_count,
        "not_implemented_count": not_implemented_count,
        "na_count": na_count
    })

@assessment.route(
    "/assessment/upload",
    methods=["POST"]
)
@jwt_required()
def upload_documents():

    assessment_id = request.form.get("assessment_id")

    files = request.files.getlist("documents")

    if not files:
        return jsonify({
            "error": "No files uploaded"
        }), 400

    # ----------------------------------
    # DOCUMENT ONLY FLOW
    # ----------------------------------

    if not assessment_id:

        current_user_id = get_jwt_identity()

        current_user = db.session.get(
            User,
            current_user_id
        )

        assessment_record = Assessment(
            user_id=current_user.id,
            university_id=current_user.university_id,
            assessment_mode="DOCUMENT",
            document_completed=True,
            status="Pending"
        )

        db.session.add(assessment_record)
        db.session.commit()

        assessment_id = assessment_record.id

    # ----------------------------------
    # QUESTIONNAIRE + DOCUMENT FLOW
    # ----------------------------------

    else:

        assessment_record = Assessment.query.get(
            assessment_id
        )

        if not assessment_record:
            return jsonify({
                "error": "Assessment not found"
            }), 404

    uploaded = []

    for file in files:

        filename = secure_filename(
            file.filename
        )

        filepath = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        file.save(filepath)

        uploaded.append(filename)

    # ----------------------------------
    # MARK DOCUMENT VERIFICATION COMPLETE
    # ----------------------------------

    assessment_record = Assessment.query.get(
        assessment_id
    )

    assessment_record.document_completed = True

    if (
        assessment_record.questionnaire_completed
        and assessment_record.document_completed
    ):
        assessment_record.status = "Completed"

    db.session.commit()

    return jsonify({
        "message": "Files uploaded successfully",
        "assessment_id": assessment_id,
        "files": uploaded
    }), 200


@assessment.route(
    "/assessment/<int:assessment_id>",
    methods=["PUT"]
)
@jwt_required()
def update_assessment(assessment_id):

    assessment = Assessment.query.get(
        assessment_id
    )

    if not assessment:
        return jsonify({
            "error": "Assessment not found"
        }), 404

    data = request.get_json()

    answers = data["answers"]

    AssessmentAnswer.query.filter_by(
        assessment_id=assessment_id
    ).delete()

    for question_id, answer in answers.items():

        db.session.add(
            AssessmentAnswer(
                assessment_id=assessment_id,
                question_id=question_id,
                answer=answer
            )
        )

    assessment.questionnaire_completed = True

    db.session.commit()

    return jsonify({
        "message": "Assessment updated"
    })