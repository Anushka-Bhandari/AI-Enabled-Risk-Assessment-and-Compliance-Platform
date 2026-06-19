import json
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

QUESTIONNAIRE_PATH = os.path.join(
    BASE_DIR,
    "..",
    "questionnaire.json"
)


def load_controls():

    with open(QUESTIONNAIRE_PATH, "r", encoding="utf-8") as file:
        questionnaire = json.load(file)

    controls = {}

    for control_name, questions in questionnaire.items():

        controls[control_name] = [
            question["id"]
            for question in questions
        ]

    return controls


def evaluate_compliance(answers):

    controls = load_controls()

    implemented_controls = []
    missing_controls = []

    for control_name, questions in controls.items():

        yes_count = sum(
            answers.get(question_id, 0)
            for question_id in questions
        )

        if yes_count == len(questions):
            implemented_controls.append(control_name)

        else:
            missing_controls.append(control_name)

    compliance_score = (
        len(implemented_controls)
        / len(controls)
    ) * 100

    return {
        "compliance_score": round(compliance_score, 2),
        "implemented_controls": implemented_controls,
        "missing_controls": missing_controls
    }


if __name__ == "__main__":

    sample_answers = {
        f"Q{i}": 1
        for i in range(1, 31)
    }

    sample_answers["Q4"] = 0
    sample_answers["Q5"] = 0
    sample_answers["Q6"] = 0

    result = evaluate_compliance(sample_answers)

    print(result)