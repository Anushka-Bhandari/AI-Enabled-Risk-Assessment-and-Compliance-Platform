import random
from collections import Counter

import numpy as np
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report


# =====================================================
# QUESTION WEIGHTS
# =====================================================

QUESTION_WEIGHTS = {
    "Q1": 2, "Q2": 2, "Q3": 2,

    "Q4": 3, "Q5": 3, "Q6": 3,

    "Q7": 4, "Q8": 4, "Q9": 4,

    "Q10": 2, "Q11": 2, "Q12": 2,

    "Q13": 4, "Q14": 4, "Q15": 4,

    "Q16": 5, "Q17": 5, "Q18": 6,

    "Q19": 6, "Q20": 6, "Q21": 6,

    "Q22": 5, "Q23": 5, "Q24": 5,

    "Q25": 6, "Q26": 6, "Q27": 6,

    "Q28": 4, "Q29": 4, "Q30": 4
}


# =====================================================
# GENERATE SYNTHETIC UNIVERSITY DATA
# =====================================================

questions = list(QUESTION_WEIGHTS.keys())

data = []
labels = []

max_score = sum(QUESTION_WEIGHTS.values())

for _ in range(5000):

    university = {}

    # Generate random Yes/No answers
    for q in questions:
        university[q] = random.choices(
            [0, 1],
            weights=[0.3, 0.7])[0]

    # Calculate weighted compliance score
    score = 0

    for q, weight in QUESTION_WEIGHTS.items():
        score += university[q] * weight

    compliance_score = (score / max_score) * 100

    # Risk classification
    if compliance_score >= 80:
        risk = "Low"

    elif compliance_score >= 50:
        risk = "Medium"

    else:
        risk = "High"

    data.append(list(university.values()))
    labels.append(risk)


# =====================================================
# CHECK CLASS DISTRIBUTION
# =====================================================

print("\nClass Distribution:")
print(Counter(labels))


# =====================================================
# CREATE DATASET
# =====================================================

df = pd.DataFrame(data, columns=questions)

X = df.values
y = np.array(labels)


# =====================================================
# TRAIN TEST SPLIT
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# =====================================================
# TRAIN MODEL
# =====================================================

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)


# =====================================================
# EVALUATE MODEL
# =====================================================

predictions = model.predict(X_test)

print("\nClassification Report:")
print(classification_report(y_test, predictions))

print(f"\nTraining Accuracy: {model.score(X_train, y_train):.4f}")
print(f"Testing Accuracy : {model.score(X_test, y_test):.4f}")


# =====================================================
# SAVE MODEL
# =====================================================

joblib.dump(model, "risk_model.pkl")

print("\nModel saved as risk_model.pkl")