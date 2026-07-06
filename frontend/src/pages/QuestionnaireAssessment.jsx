import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const QUESTION_STAGES = [
  {
    id: "access-control",
    title: "Access Control",
    description: "Identity, authentication, and privilege management controls.",
    questions: [
      { id: 101, text: "Is multi-factor authentication enforced for all administrative accounts?" },
      { id: 102, text: "Are user access rights reviewed at least quarterly?" },
      { id: 103, text: "Is a formal least-privilege policy documented and enforced?" },
      { id: 104, text: "Are privileged sessions logged and monitored in real time?" },
    ],
  },
  {
    id: "data-protection",
    title: "Data Protection",
    description: "Encryption, classification, and data lifecycle safeguards.",
    questions: [
      { id: 201, text: "Is sensitive institutional data encrypted at rest?" },
      { id: 202, text: "Is data encrypted in transit using current TLS standards?" },
      { id: 203, text: "Does a documented data retention and disposal policy exist?" },
      { id: 204, text: "Is data classified according to sensitivity tiers?" },
    ],
  },
  {
    id: "ai-governance",
    title: "AI Governance",
    description: "Oversight, transparency, and risk controls for AI systems.",
    questions: [
      { id: 301, text: "Is there a formal inventory of AI/ML models in production use?" },
      { id: 302, text: "Are AI model outputs subject to human review before high-stakes decisions?" },
      { id: 303, text: "Is there a documented AI risk management framework in place?" },
      { id: 304, text: "Are third-party AI vendors assessed for compliance before onboarding?" },
    ],
  },
  {
    id: "incident-response",
    title: "Incident Response",
    description: "Detection, escalation, and recovery preparedness.",
    questions: [
      { id: 401, text: "Does a documented incident response plan exist and gets tested annually?" },
      { id: 402, text: "Is there a 24/7 monitoring capability for security events?" },
      { id: 403, text: "Are breach notification procedures aligned with regulatory timelines?" },
      { id: 404, text: "Are post-incident reviews conducted and tracked to remediation?" },
    ],
  },
];

export default function QuestionnaireAssessment() {
  const navigate = useNavigate();

  const [currentStage, setCurrentStage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const totalStages = QUESTION_STAGES.length;
  const stage = QUESTION_STAGES[currentStage];

  const totalQuestions = useMemo(
    () => QUESTION_STAGES.reduce((sum, s) => sum + s.questions.length, 0),
    []
  );
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
      const token = localStorage.getItem("access_token");

      const payload = {
        answers: QUESTION_STAGES.flatMap((s) =>
          s.questions.map((q) => ({
            question_id: q.id,
            category: s.id,
            question_text: q.text,
            // Strict string value matching AssessmentAnswer.answer constraint
            answer: answers[q.id] === true ? "Yes" : "No",
          }))
        ),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/assessment/submit`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const assessmentId = response?.data?.assessment_id;
      navigate("/assessment/upload", { state: { assessmentId } });
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
            {QUESTION_STAGES.map((s, index) => {
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
                    {q.text}
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