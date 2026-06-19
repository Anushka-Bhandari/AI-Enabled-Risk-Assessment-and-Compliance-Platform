from flask import Blueprint, request, jsonify

from app.ml.predict import predict_risk
from ml_model.compliance_engine import evaluate_compliance

compliance = Blueprint("compliance", __name__)


@compliance.route("/compliance-check", methods=["POST"])
def compliance_check():

    answers = request.get_json()

    risk_level = predict_risk(answers)

    compliance_result = evaluate_compliance(answers)

    return jsonify({
        "risk_level": risk_level,
        "compliance_score": compliance_result["compliance_score"],
        "implemented_controls": compliance_result["implemented_controls"],
        "missing_controls": compliance_result["missing_controls"]
    }), 200