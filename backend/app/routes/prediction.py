from flask import Blueprint, request, jsonify

from app.ml.predict import predict_risk

prediction = Blueprint("prediction", __name__)


@prediction.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    risk_level = predict_risk(data)

    return jsonify({
        "risk_level": risk_level
    }), 200