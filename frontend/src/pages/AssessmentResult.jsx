import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Download,
  Loader2,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// Central theme registry keyed to the assessment's risk_level payload value
const RISK_THEME = {
  Low: {
    label: "Low Risk",
    ring: "#10B981",
    ringTrack: "#D1FAE5",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-700",
    glow: "shadow-[0_0_60px_rgba(16,185,129,0.18)]",
    banner: null,
  },
  Medium: {
    label: "Medium Risk",
    ring: "#F59E0B",
    ringTrack: "#FEF3C7",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    badgeText: "text-amber-700",
    glow: "shadow-[0_0_60px_rgba(245,158,11,0.18)]",
    banner: {
      bg: "bg-amber-50 border-amber-300",
      text: "text-amber-800",
      icon: "text-amber-600",
      pulse: false,
    },
  },
  High: {
    label: "High Risk",
    ring: "#DC2626",
    ringTrack: "#FEE2E2",
    badgeBg: "bg-red-50",
    badgeBorder: "border-red-200",
    badgeText: "text-red-700",
    glow: "shadow-[0_0_70px_rgba(220,38,38,0.25)]",
    banner: {
      bg: "bg-red-50 border-red-300",
      text: "text-red-800",
      icon: "text-red-600",
      pulse: true,
    },
  },
};

export default function AssessmentResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const assessmentId = location.state?.assessmentId;

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/assessment/${assessmentId}/result`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResult(response.data);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to load the assessment report.";
        setLoadError(message);
      } finally {
        setIsLoading(false);
      }
    };

    if (assessmentId) {
      fetchResult();
    } else {
      setLoadError("No assessment reference was provided.");
      setIsLoading(false);
    }
  }, [assessmentId]);

  useEffect(() => {
    if (!result) return;
    const target = result.compliance_score ?? 0;
    let frame;
    let current = 0;
    const step = () => {
      current += Math.max(1, Math.ceil((target - current) / 8));
      if (current >= target) {
        setAnimatedScore(target);
        return;
      }
      setAnimatedScore(current);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [result]);

  const theme = useMemo(() => {
    const level = result?.risk_level || "Medium";
    return RISK_THEME[level] || RISK_THEME.Medium;
  }, [result]);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = Math.min(100, Math.max(0, result?.compliance_score ?? 0));
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  const implementedControls = result?.implemented_controls || [];
  const criticalGaps = result?.critical_gaps || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#0B2A66] animate-spin" />
          <p className="text-sm text-slate-500 font-medium">
            Compiling institutional risk report…
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/70 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Report unavailable
          </h2>
          <p className="text-sm text-slate-500 mb-6">{loadError}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2A66] text-white font-semibold transition-all duration-300 hover:bg-slate-900 hover:scale-[1.01]"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* High-risk alert banner */}
      {theme.banner && (
        <div
          className={`w-full border-b px-6 py-3 flex items-center justify-center gap-2.5 ${
            theme.banner.bg
          } ${theme.banner.pulse ? "animate-pulse" : ""}`}
        >
          <ShieldAlert className={`w-5 h-5 ${theme.banner.icon}`} />
          <p className={`text-sm font-semibold ${theme.banner.text}`}>
            {result?.risk_level === "High"
              ? "Critical risk exposure detected — immediate remediation recommended."
              : "Elevated risk factors identified — review recommended remediation items."}
          </p>
        </div>
      )}

      <div className="bg-[#0B2A66] text-white">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-200/80">
              Executive Compliance Report
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {result?.university_name || "Institutional"} Risk Posture Summary
          </h1>
          <p className="text-blue-100/70 text-sm mt-2">
            Generated {result?.generated_at || "just now"} · Assessment #
            {assessmentId}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-6">
        {/* Score Ring Card */}
        <div
          className={`bg-white rounded-3xl border border-slate-200/70 px-8 py-10 flex flex-col md:flex-row items-center gap-10 transition-all duration-500 ${theme.glow}`}
        >
          <div className="relative w-64 h-64 shrink-0">
            <svg viewBox="0 0 280 280" className="w-full h-full -rotate-90">
              <circle
                cx="140"
                cy="140"
                r={radius}
                fill="none"
                stroke={theme.ringTrack}
                strokeWidth="20"
              />
              <circle
                cx="140"
                cy="140"
                r={radius}
                fill="none"
                stroke={theme.ring}
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-5xl font-bold text-slate-900">
                {animatedScore}
              </span>
              <span className="text-xs font-semibold text-slate-400 tracking-wide mt-1">
                COMPLIANCE SCORE
              </span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} font-semibold text-sm mb-4`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.ring }}
              />
              {theme.label}
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Overall Governance Assessment
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {result?.summary ||
                "This institution's cybersecurity and AI governance posture has been evaluated across access control, data protection, AI governance, and incident response domains."}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200/70 px-4 py-3">
                <p className="font-mono text-lg font-bold text-slate-900">
                  {implementedControls.length}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Controls Met</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200/70 px-4 py-3">
                <p className="font-mono text-lg font-bold text-slate-900">
                  {criticalGaps.length}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Gaps Found</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200/70 px-4 py-3">
                <p className="font-mono text-lg font-bold text-slate-900">
                  {result?.documents_reviewed ?? 0}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Docs Reviewed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column: Implemented vs Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Implemented Controls */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/70 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900">
                Implemented Controls
              </h3>
            </div>

            <div className="space-y-3">
              {implementedControls.length === 0 && (
                <p className="text-sm text-slate-400 italic">
                  No verified controls recorded yet.
                </p>
              )}
              {implementedControls.map((control, index) => (
                <div
                  key={control.id || index}
                  className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 transition-all duration-300 hover:shadow-md hover:border-emerald-200"
                >
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {control.title || control.question_text}
                    </p>
                    {control.category && (
                      <p className="text-xs text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
                        {control.category}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Gaps */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/70 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-slate-900">
                Critical Security Gaps
              </h3>
            </div>

            <div className="space-y-3">
              {criticalGaps.length === 0 && (
                <p className="text-sm text-slate-400 italic">
                  No critical gaps identified.
                </p>
              )}
              {criticalGaps.map((gap, index) => (
                <div
                  key={gap.id || index}
                  className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 transition-all duration-300 hover:shadow-md hover:border-red-200"
                >
                  <AlertTriangle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {gap.title || gap.question_text}
                    </p>
                    {gap.category && (
                      <p className="text-xs text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
                        {gap.category}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/assessment/questionnaire")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 transition-all duration-300 hover:bg-slate-50 hover:scale-[1.01]"
            >
              <RefreshCcw className="w-4 h-4" />
              Reassess
            </button>

            <a
              href={`${API_BASE_URL}/api/assessment/${assessmentId}/report/download`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-[#0B2A66] shadow-lg shadow-blue-900/20 transition-all duration-300 hover:bg-slate-900 hover:scale-[1.01] hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              Download Full Report
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}