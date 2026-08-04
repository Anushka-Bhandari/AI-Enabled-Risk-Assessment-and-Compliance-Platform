import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/authService";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  LayoutDashboard,
  ScrollText,
  AlertTriangle,
  Search,
  Users,
  Building2,
  Radio,
  ClipboardCheck,
  History,
  FileBarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ------------------------------------------------------------------ */
/*  Design tokens — matches SecurityCommandCenter.jsx                  */
/*  bg-deep   #020817   page background                                */
/*  bg-panel  #0B1120   sidebar / header                                */
/*  bg-card   #111827   card surfaces                                   */
/*  accent    cyan  #22D3EE   primary glow / signature                  */
/* ------------------------------------------------------------------ */

const NAV_SECTIONS = [
  {
    section: "OPERATIONS",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { key: "activity-logs", label: "Activity Logs", icon: ScrollText, path: "/activity-logs" },
      { key: "alerts", label: "Alerts", icon: AlertTriangle, path: "/alerts" },
      { key: "investigations", label: "Investigations", icon: Search, path: "/investigations" },
    ],
  },
  {
    section: "MONITORING",
    items: [
      { key: "faculty-activity", label: "Faculty Activity", icon: Users, path: "/faculty-activity" },
      { key: "departments", label: "Departments", icon: Building2, path: "/departments" },
      { key: "event-stream", label: "Event Stream", icon: Radio, path: "/event-stream" },
    ],
  },
  {
    section: "ASSESSMENT",
    items: [
      { key: "new-assessment", label: "New Assessment", icon: ClipboardCheck, path: "/assessments/new" },
      { key: "assessment-history", label: "Assessment History", icon: History, path: "/assessment-history" },
      { key: "compliance-reports", label: "Compliance Reports", icon: FileBarChart2, path: "/compliance-reports" },
    ],
  },
  {
    section: "SETTINGS",
    items: [{ key: "configuration", label: "Configuration", icon: Settings, path: "/configuration" }],
  },
];

// Status -> visual language, dark-theme equivalents of the old light-mode
// emerald/yellow/red/gray scheme.
const STATUS_STYLES = {
  Implemented: {
    border: "border-emerald-400/40",
    ring: "shadow-[0_0_28px_-10px_rgba(16,185,129,0.55)]",
    chipActive: "bg-emerald-500 text-white border-emerald-400",
    chipIdle: "border-white/10 text-slate-400 hover:border-emerald-400/30 hover:text-emerald-300",
  },
  "Partially Implemented": {
    border: "border-yellow-400/40",
    ring: "shadow-[0_0_28px_-10px_rgba(234,179,8,0.55)]",
    chipActive: "bg-yellow-500 text-white border-yellow-400",
    chipIdle: "border-white/10 text-slate-400 hover:border-yellow-400/30 hover:text-yellow-300",
  },
  "Not Implemented": {
    border: "border-red-400/40",
    ring: "shadow-[0_0_28px_-10px_rgba(239,68,68,0.55)]",
    chipActive: "bg-red-500 text-white border-red-400",
    chipIdle: "border-white/10 text-slate-400 hover:border-red-400/30 hover:text-red-300",
  },
  "Not Applicable": {
    border: "border-slate-400/40",
    ring: "shadow-[0_0_28px_-10px_rgba(148,163,184,0.45)]",
    chipActive: "bg-slate-500 text-white border-slate-400",
    chipIdle: "border-white/10 text-slate-400 hover:border-slate-400/30 hover:text-slate-200",
  },
};

const ANSWER_OPTIONS = [
  { value: "Implemented", label: "Implemented" },
  { value: "Partially Implemented", label: "Partial" },
  { value: "Not Implemented", label: "Not Implemented" },
  { value: "Not Applicable", label: "N/A" },
];

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function QuestionnaireAssessment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [questionStages, setQuestionStages] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuestions = async () => {
    setLoadError("");
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
      setLoadError("Unable to load the questionnaire right now. Please try again.");
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const totalStages = questionStages.length;

  const stage = questionStages.length > 0 ? questionStages[currentStage] : null;

  const totalQuestions = useMemo(
    () => questionStages.reduce((sum, s) => sum + (s.questions?.length || 0), 0),
    [questionStages]
  );

  // ===== LOADING / ERROR STATES =====

  if (loadError) {
    return (
      <div className="min-h-screen w-full bg-[#020817] text-slate-200 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-300">{loadError}</p>
            <button
              onClick={fetchQuestions}
              className="mt-3 text-xs font-semibold text-red-300 hover:text-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questionStages.length === 0) {
    return (
      <div className="min-h-screen w-full bg-[#020817] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-xs font-mono text-slate-500 tracking-wide">Loading questionnaire…</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const overallProgress = Math.round((answeredCount / totalQuestions) * 100);

  const stageAnsweredCount = stage.questions.filter((q) => answers[q.id] !== undefined).length;
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

    if (Object.keys(answers).length !== totalQuestions) {
      setSubmitError("Please answer all questions.");
      setIsSubmitting(false);
      return;
    }

    try {
      const answersDict = {};

      questionStages.forEach((s) => {
        s.questions.forEach((q) => {
          answersDict[String(q.id)] = answers[q.id];
        });
      });

      const payload = { answers: answersDict };

      const response = await API.post("/assessment", payload);
      const assessmentId = response?.data?.assessment_id;

      await API.post("/assessment/run", { assessment_id: assessmentId });

      navigate("/assessment/result", { state: { assessmentId } });
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
    <div className="min-h-screen w-full bg-[#020817] text-slate-200 flex font-sans antialiased">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-[#0B1120] border-r border-white/[0.06] z-40 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        <div className="relative z-10 flex items-center justify-between px-6 py-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
              <span className="absolute inset-0 rounded-xl border border-cyan-400/40 animate-ping opacity-40" />
              <ShieldCheck className="w-5 h-5 text-cyan-300" strokeWidth={2.25} />
            </div>
            <div>
              <p className="font-semibold tracking-wide text-sm text-white leading-tight">
                CommandCenter
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-cyan-400/70 font-mono">
                Univ. Security Ops
              </p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative z-10 flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          {NAV_SECTIONS.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-500 font-mono">
                {group.section}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSidebarOpen(false);
                        navigate(item.path);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? "bg-cyan-400/[0.08] text-white border border-cyan-400/20 shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100 border border-transparent"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300"}`}
                        strokeWidth={2}
                      />
                      {item.label}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-cyan-400/70" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative z-10 px-4 pb-6 pt-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-slate-100 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-[#0B1120]/85 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center gap-4 px-4 sm:px-8 py-4">
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            <div className="min-w-0 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <ClipboardList className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                  Cybersecurity &amp; AI Governance Questionnaire
                </h1>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Stage {currentStage + 1} of {totalStages} · {stage.title}
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30">
                <span className="text-[11px] font-semibold tracking-wide text-cyan-300 font-mono">
                  {overallProgress}% COMPLETE
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 flex items-center justify-center font-semibold text-xs">
                {getInitials("Security Admin")}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 space-y-6">
          {/* ================= PROGRESS TRACKER ================= */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">
                Stage {currentStage + 1} of {totalStages}: {stage.title}
              </span>
              <span className="text-sm font-mono font-semibold text-cyan-300">
                {overallProgress}% complete
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden mb-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_12px_0_rgba(34,211,238,0.6)] transition-all duration-700 ease-out"
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
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all duration-300 font-mono ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isActive
                          ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/40 ring-4 ring-cyan-400/10"
                          : "bg-white/[0.04] text-slate-500 border border-white/[0.06]"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                    </div>
                    {index < totalStages - 1 && (
                      <div
                        className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                          isDone ? "bg-emerald-400/60" : "bg-white/[0.06]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================= QUESTION CARDS ================= */}
          <section className="space-y-4">
            <p className="text-xs text-slate-500 font-mono px-1">{stage.description}</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {stage.questions.map((q, qIndex) => {
                  const currentAnswer = answers[q.id];
                  const style = STATUS_STYLES[currentAnswer];

                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border bg-white/[0.03] backdrop-blur-xl px-6 sm:px-8 py-6 transition-all duration-300 ${
                        style ? `${style.border} ${style.ring}` : "border-white/[0.06]"
                      }`}
                    >
                      <div className="flex flex-col gap-5">
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs font-semibold text-cyan-400/70 mt-1 shrink-0">
                            {String(qIndex + 1).padStart(2, "0")}
                          </span>
                          <p className="text-[15px] font-medium text-slate-200 leading-relaxed">
                            {q.question}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {ANSWER_OPTIONS.map((opt) => {
                            const isSelected = currentAnswer === opt.value;
                            const optStyle = STATUS_STYLES[opt.value];
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelect(q.id, opt.value)}
                                className={`w-36 h-11 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                  isSelected ? optStyle.chipActive : `bg-white/[0.02] ${optStyle.chipIdle}`
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {submitError && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{submitError}</p>
              </div>
            )}

            {/* ================= NAVIGATION ================= */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={goBack}
                disabled={currentStage === 0}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl font-semibold text-sm text-slate-300 bg-white/[0.03] border border-white/[0.08] transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {isLastStage ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStageComplete || isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-[#020817] bg-cyan-400 shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] transition-all duration-200 hover:bg-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
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
                  className="flex items-center gap-1.5 px-6 py-3 rounded-xl font-semibold text-sm text-[#020817] bg-cyan-400 shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] transition-all duration-200 hover:bg-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Next Stage
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}