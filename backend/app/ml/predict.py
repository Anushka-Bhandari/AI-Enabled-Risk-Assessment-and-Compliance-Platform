import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "..",
    "ml_model",
    "risk_model.pkl"
)

model = joblib.load(MODEL_PATH)


def predict_risk(answers):

    feature_order = [
        "Q1","Q2","Q3","Q4","Q5","Q6",
        "Q7","Q8","Q9","Q10","Q11","Q12",
        "Q13","Q14","Q15","Q16","Q17","Q18",
        "Q19","Q20","Q21","Q22","Q23","Q24",
        "Q25","Q26","Q27","Q28","Q29","Q30"
    ]

    features = []

    for question in feature_order:
        features.append(answers.get(question, 0))

    prediction = model.predict(
        np.array([features])
    )[0]

    return prediction

if __name__ == "__main__":

    sample = {
        f"Q{i}": 1
        for i in range(1, 31)
    }

    print(predict_risk(sample))