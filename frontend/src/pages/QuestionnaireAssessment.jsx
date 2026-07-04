import { useState } from "react";
import questionnaire from "../data/questionnaire.json";
import { useNavigate } from "react-router-dom";

export default function QuestionnaireAssessment() {

    const navigate = useNavigate();

    const categories = Object.keys(questionnaire);

    const [currentCategory, setCurrentCategory] = useState(0);

    const [answers, setAnswers] = useState({});

    const handleAnswer = (questionId, value) => {
        setAnswers({
            ...answers,
            [questionId]: value,
        });
    };

    const nextCategory = () => {

        const unanswered = questions.some(
            (q) => answers[q.id] === undefined
        );

        if (unanswered) {
            alert("Please answer all questions.");
            return;
        }

        if (currentCategory < categories.length - 1) {
            setCurrentCategory(currentCategory + 1);
        }
    };
    const prevCategory = () => {
        if (currentCategory > 0) {
            setCurrentCategory(currentCategory - 1);
        }
    };

    const handleSubmit = async () => {
        try {

            const token = localStorage.getItem("token");

            const payload = {
                university_id: 1,
                answers: answers
            };

            const response = await fetch(
                "http://localhost:5000/assessment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            const totalQuestions = 30;

            const yesCount = Object.values(answers)
                .filter(answer => answer === true)
                .length;

            const complianceScore = Math.round(
                (yesCount / totalQuestions) * 100
            );

            let riskLevel = "High";

            if (complianceScore >= 80) {
                riskLevel = "Low";
            }
            else if (complianceScore >= 50) {
                riskLevel = "Medium";
            }

            navigate("/assessment-result", {
                state: {
                    assessment_id: data.assessment_id,
                    risk_level: riskLevel,
                    compliance_score: complianceScore,
                    implemented_controls: Object.entries(answers)
                        .filter(([_, value]) => value)
                        .map(([key]) => key),

                    missing_controls: Object.entries(answers)
                        .filter(([_, value]) => !value)
                        .map(([key]) => key)
                }
            });

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const categoryName = categories[currentCategory];

    const questions = questionnaire[categoryName];

    const progress = Math.round(
        ((currentCategory + 1) / categories.length) * 100
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">

            <div className="max-w-5xl mx-auto p-8">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-4xl font-bold text-[#0B2A66]">
                        Compliance Assessment
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Complete all assessment sections.
                    </p>

                </div>

                {/* Progress */}
                <div className="bg-white rounded-2xl border p-6 mb-6">

                    <div className="flex justify-between mb-3">

                        <span className="font-medium">
                            Progress
                        </span>

                        <span>
                            {currentCategory + 1} / {categories.length}
                        </span>

                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-3">

                        <div
                            className="bg-[#0B2A66] h-3 rounded-full"
                            style={{
                                width: `${progress}%`
                            }}
                        />

                    </div>

                </div>

                {/* Questions */}
                <div className="bg-white rounded-2xl border p-8">

                    <h2 className="text-2xl font-semibold text-[#0B2A66] mb-6">
                        {categoryName}
                    </h2>

                    <div className="space-y-6">

                        {questions.map((question) => (

                            <div
                                key={question.id}
                                className="border rounded-xl p-5"
                            >

                                <p className="font-medium mb-4">
                                    {question.question}
                                </p>

                                <div className="flex gap-4 mt-4">

                                    <label
                                        className={`px-6 py-3 rounded-xl border cursor-pointer transition
                                                ${answers[question.id] === true
                                                ? "bg-green-600 text-white border-green-600"
                                                : "bg-white"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={question.id}
                                            className="hidden"
                                            checked={answers[question.id] === true}
                                            onChange={() =>
                                                handleAnswer(question.id, true)
                                            }
                                        />

                                        Yes
                                    </label>

                                    <label
                                        className={`px-6 py-3 rounded-xl border cursor-pointer transition
                                                ${answers[question.id] === false
                                                ? "bg-red-600 text-white border-red-600"
                                                : "bg-white"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={question.id}
                                            className="hidden"
                                            checked={answers[question.id] === false}
                                            onChange={() =>
                                                handleAnswer(question.id, false)
                                            }
                                        />

                                        No
                                    </label>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">

                        <button
                            onClick={prevCategory}
                            disabled={currentCategory === 0}
                            className="px-6 py-3 border rounded-xl disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {currentCategory === categories.length - 1 ? (

                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-[#0B2A66] text-white rounded-xl"
                            >
                                Submit Assessment
                            </button>

                        ) : (

                            <button
                                onClick={nextCategory}
                                className="px-8 py-3 bg-[#0B2A66] text-white rounded-xl"
                            >
                                Next
                            </button>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}