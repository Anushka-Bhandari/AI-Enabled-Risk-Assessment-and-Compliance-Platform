# routes/questionnaire.py

import json
from flask import Blueprint, jsonify


import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

QUESTIONNAIRE_PATH = os.path.join(
    BASE_DIR,
    "questionnaire.json"
)

with open(QUESTIONNAIRE_PATH, "r", encoding="utf-8") as file:
    questionnaire = json.load(file)

questionnaire_bp = Blueprint("questionnaire", __name__)

@questionnaire_bp.route("/questions", methods=["GET"])
def get_questions():
    return jsonify(questionnaire)