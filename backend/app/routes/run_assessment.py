from app.services.compliance_engine import ComplianceEngine
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError

from app.database import db
from app.models import (
    Assessment,
    AssessmentDocument,
    Document,
    User
)

run_assessment = Blueprint(
    "run_assessment",
    __name__
)

@run_assessment.route(
    "/assessment/run",
    methods=["POST"]
)
@jwt_required()
def run_assessment_route():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data provided."
        }), 400

    assessment_id = data.get("assessment_id")
    selected_document_ids = data.get(
        "selected_document_ids",
        []
    )

    current_user = db.session.get(
        User,
        get_jwt_identity()
    )

    if not current_user:
        return jsonify({
            "error": "User not found."
        }), 404

    try:

        # -----------------------------
        # Combined Assessment
        # -----------------------------
        if assessment_id and selected_document_ids:

            assessment = db.session.get(
                Assessment,
                assessment_id
            )

            if not assessment:
                return jsonify({
                    "error": "Assessment not found."
                }), 404

            assessment.assessment_mode = "COMBINED"

            for document_id in selected_document_ids:

                document = db.session.get(
                    Document,
                    document_id
                )

                if not document:
                    return jsonify({
                        "error": f"Document {document_id} not found."
                    }), 404

                db.session.add(
                    AssessmentDocument(
                        assessment_id=assessment.id,
                        document_id=document.id
                    )
                )

        # -----------------------------
        # Questionnaire Only
        # -----------------------------
        elif assessment_id:

            assessment = db.session.get(
                Assessment,
                assessment_id
            )

            if not assessment:
                return jsonify({
                    "error": "Assessment not found."
                }), 404

        # -----------------------------
        # Documents Only
        # -----------------------------
        elif selected_document_ids:

            assessment = Assessment(
                user_id=current_user.id,
                university_id=current_user.university_id,
                assessment_mode="DOCUMENT"
            )

            db.session.add(assessment)
            db.session.flush()

            for document_id in selected_document_ids:

                document = db.session.get(
                    Document,
                    document_id
                )

                if not document:
                    return jsonify({
                        "error": f"Document {document_id} not found."
                    }), 404

                db.session.add(
                    AssessmentDocument(
                        assessment_id=assessment.id,
                        document_id=document.id
                    )
                )

        else:
            return jsonify({
                "error": "Assessment ID or selected document IDs are required."
            }), 400

        # -----------------------------
        # Compliance Engine
        # -----------------------------

        compliance_engine = ComplianceEngine(
            assessment.id
        )

        compliance_result = compliance_engine.run()

        db.session.commit()

    except IntegrityError:
        db.session.rollback()

        return jsonify({
            "error": "Database integrity error."
        }), 400

    except Exception:
        db.session.rollback()

        return jsonify({
            "error": "Unable to run assessment."
        }), 500

    return jsonify({

        "message": "Assessment completed successfully.",

        "assessment_id": assessment.id,

        "assessment_mode": assessment.assessment_mode,

        "compliance": compliance_result

    }), 200