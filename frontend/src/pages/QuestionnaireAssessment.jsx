import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/authService";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


export default function QuestionnaireAssessment() {
  const navigate = useNavigate();

  const [currentStage, setCurrentStage] = useState(0);
const [questionStages, setQuestionStages] = useState([]);
const [answers, setAnswers] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState("");

 useEffect(() => {
  fetchQuestions();
}, []);

const fetchQuestions = async () => {
  try {
    const response = await API.get("/questions");

    const groupedStages = [
      {
        id: "governance",
        title: "Governance",
        description: "Questions 1-10",
        questions: response.data.questions.slice(0, 10),
      },
      {
        id: "security",
        title: "Security",
        description: "Questions 11-20",
        questions: response.data.questions.slice(10, 20),
      },
      {
        id: "privacy",
        title: "Privacy",
        description: "Questions 21-30",
        questions: response.data.questions.slice(20, 30),
      },
      {
        id: "compliance",
        title: "Compliance",
        description: "Questions 31-40",
        questions: response.data.questions.slice(30, 40),
      },
      {
        id: "risk",
        title: "Risk Management",
        description: "Questions 41-50",
        questions: response.data.questions.slice(40, 50),
      },
    ];

    setQuestionStages(groupedStages);
  } catch (error) {
    console.error(error);
  }
};

// ===== MOVE THESE HERE =====

const totalStages = questionStages.length;

const stage =
  questionStages.length > 0
    ? questionStages[currentStage]
    : null;

const totalQuestions = useMemo(
  () =>
    questionStages.reduce(
      (sum, s) => sum + (s.questions?.length || 0),
      0
    ),
  [questionStages]
);

// ===== LOADING CHECK AFTER HOOKS =====

if (questionStages.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
  const answeredCount = Object.keys(answers).length;
  const overallProgress = Math.round((answeredCount / totalQuestions) * 100);

  const stageAnsweredCount = stage.questions.filter(
    (q) => answers[q.id] !== undefined
  ).length;
  const isStageComplete = stageAnsweredCount === stage.questions.length;
  const isLastStage = currentStage === totalStages - 1;

  const handleSelect = (questionId, value) => {
    // Convert to strict "Yes" / "No" string values to match the
    // AssessmentAnswer child table constraint
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSubmitError("");
  };

  const goNext = () => {
    if (!isLastStage) {
      setCurrentStage((prev) => Math.min(prev + 1, totalStages - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setCurrentStage((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN =", token);

      const answersDict = {};

questionStages.forEach((stage) => {
  stage.questions.forEach((q) => {
    answersDict[String(q.id)] =
      answers[q.id] === true
        ? "Implemented"
        : "Not Implemented";
  });
});

const payload = {
  answers: answersDict,
};

console.log(payload);

      const response = await API.post(
  "/assessment",
  payload
);

      const assessmentId = response?.data?.assessment_id;
      navigate("/assessment/result", {
  state: { assessmentId }
});
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to submit the questionnaire. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-[#0B2A66] text-white">
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-200/80">
              Institutional Assessment
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Cybersecurity &amp; AI Governance Questionnaire
          </h1>
          <p className="text-blue-100/70 text-sm mt-2">
            Answer each control statement honestly — your responses shape the
            institutional risk posture report.
          </p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="max-w-4xl mx-auto px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/70 px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">
              Stage {currentStage + 1} of {totalStages}: {stage.title}
            </span>
            <span className="text-sm font-mono font-semibold text-slate-500">
              {overallProgress}% complete
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#0B2A66] to-emerald-500 transition-all duration-700 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            {questionStages.map((s, index) => {
              const isDone = index < currentStage;
              const isActive = index === currentStage;
              return (
                <div key={s.id} className="flex-1 flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all duration-300 ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "bg-[#0B2A66] text-white ring-4 ring-blue-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>
                  {index < totalStages - 1 && (
                    <div
                      className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                        isDone ? "bg-emerald-400" : "bg-slate-100"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Cards */}
      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-4">
        <div className="mb-2">
          <p className="text-sm text-slate-500">{stage.description}</p>
        </div>

        {stage.questions.map((q, qIndex) => {
          const currentAnswer = answers[q.id];
          const isYes = currentAnswer === true;
          const isNo = currentAnswer === false;

          return (
            <div
              key={q.id}
              className={`rounded-2xl border-2 bg-white shadow-sm px-6 py-5 transition-all duration-300 ${
                isYes
                  ? "border-emerald-300 shadow-emerald-100"
                  : isNo
                  ? "border-red-300 shadow-red-100"
                  : "border-slate-200/70"
              }`}
            >
              <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-semibold text-slate-400 mt-1">
                    {String(qIndex + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-relaxed">
                    {q.question}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, true)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-300 hover:scale-[1.03] ${
                      isYes
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-white border-emerald-200 text-emerald-600 hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, false)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-300 hover:scale-[1.03] ${
                      isNo
                        ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/30"
                        : "bg-white border-red-200 text-red-600 hover:border-red-400 hover:shadow-[0_0_12px_rgba(220,38,38,0.25)]"
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    No
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {submitError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStage === 0}
            className="flex items-center gap-1.5 px-5 py-3 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 transition-all duration-300 hover:bg-slate-50 hover:scale-[1.01] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {isLastStage ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isStageComplete || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[#0B2A66] shadow-lg shadow-blue-900/20 transition-all duration-300 hover:bg-slate-900 hover:scale-[1.01] hover:shadow-xl disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Questionnaire"
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!isStageComplete}
              className="flex items-center gap-1.5 px-6 py-3 rounded-xl font-semibold text-white bg-[#0B2A66] shadow-lg shadow-blue-900/20 transition-all duration-300 hover:bg-slate-900 hover:scale-[1.01] hover:shadow-xl disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              Next Stage
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}