import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Download,
  Loader2,
  RefreshCcw,
  ArrowLeft,
  FileText,
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Gauge,
  ClipboardList,
  CircleSlash,
  LayoutDashboard,
  ScrollText,
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
  ChevronRight,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ------------------------------------------------------------------ */
/*  Design tokens — matches SecurityCommandCenter.jsx / QuestionnaireAssessment.jsx / NewAssessment.jsx */
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

// Central theme registry keyed to the assessment's risk_level payload value
const RISK_THEME = {
  Low: {
    label: "Low Risk",
    ring: "#10B981",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-400/30",
    badgeText: "text-emerald-300",
    banner: null,
  },
  Medium: {
    label: "Medium Risk",
    ring: "#F59E0B",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-400/30",
    badgeText: "text-amber-300",
    banner: {
      bg: "bg-amber-500/10 border-amber-400/30",
      text: "text-amber-200",
      icon: "text-amber-400",
      pulse: false,
    },
  },
  High: {
    label: "High Risk",
    ring: "#DC2626",
    badgeBg: "bg-red-500/10",
    badgeBorder: "border-red-400/30",
    badgeText: "text-red-300",
    banner: {
      bg: "bg-red-500/10 border-red-400/30",
      text: "text-red-200",
      icon: "text-red-400",
      pulse: true,
    },
  },
};

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function AssessmentResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const assessmentId = location.state?.assessmentId;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [riskData, setRiskData] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      await axios.post(`${API_BASE_URL}/reports/generate/${assessmentId}`);

      const response = await axios.get(
        `${API_BASE_URL}/reports/download/${assessmentId}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = `assessment_${assessmentId}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

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

        console.log(response.data);
        setResult(response.data);

        const riskResponse = await axios.get(
          `${API_BASE_URL}/assessment/${assessmentId}/risk`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRiskData(riskResponse.data);
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
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  const implementedControls = result?.implemented_controls || [];
  const criticalGaps = result?.critical_gaps || [];

  const isPending = result?.status === "Pending";

  const complianceChartData = [
    { name: "Implemented", value: result?.implemented_count || 0 },
    { name: "Partial", value: result?.partial_count || 0 },
    { name: "Not Implemented", value: result?.not_implemented_count || 0 },
    { name: "N/A", value: result?.na_count || 0 },
  ];

  // --- Presentation-only derived values (no new data sources, no changes
  // to result / riskData / assessmentId) ---------------------------------

  const COMPLIANCE_COLORS = {
    Implemented: "#10B981",
    Partial: "#F59E0B",
    "Not Implemented": "#DC2626",
    "N/A": "#64748B",
  };

  const complianceTotal = complianceChartData.reduce((sum, d) => sum + d.value, 0);
  const implementedPercent = complianceTotal
    ? Math.round(((result?.implemented_count || 0) / complianceTotal) * 100)
    : 0;

  const categoryRisks = riskData?.category_risks || [];

  const riskBarColor = (score) => {
    if (score >= 70) return "#DC2626";
    if (score >= 40) return "#F59E0B";
    return "#10B981";
  };

  const sortedCategoryRisks = useMemo(
    () => [...categoryRisks].sort((a, b) => (b.risk_score ?? 0) - (a.risk_score ?? 0)),
    [categoryRisks]
  );

  const highestRiskCategory = sortedCategoryRisks[0] || null;
  const lowestRiskCategory =
    sortedCategoryRisks.length > 0
      ? sortedCategoryRisks[sortedCategoryRisks.length - 1]
      : null;

  // --- Verification workflow (added) --------------------------------------
  const questionnaireCompleted = !!result?.questionnaire_completed;
  const documentCompleted = !!result?.document_completed;

  let verificationType = "";
  let verificationBadge = "";

  if (questionnaireCompleted && documentCompleted) {
    verificationType = "Combined Analysis";
    verificationBadge = "Completed";
  } else if (documentCompleted) {
    // Document is priority — questionnaire remains optional
    verificationType = "Document Analysis";
    verificationBadge = "Optional";
  } else if (questionnaireCompleted) {
    // Questionnaire done — document verification still pending
    verificationType = "Questionnaire Assessment";
    verificationBadge = "Pending";
  }

  const verificationBadgeStyles = {
    Optional: "bg-amber-500/10 text-amber-300 border border-amber-400/30",
    Pending: "bg-orange-500/10 text-orange-300 border border-orange-400/30",
    Completed: "bg-emerald-500/10 text-emerald-300 border border-emerald-400/30",
  };

  const trendCopy = useMemo(() => {
    const level = riskData?.overall_risk_level || result?.risk_level;
    if (level === "High") {
      return {
        label: "Requires attention",
        Icon: TrendingUp,
        tone: "text-red-400",
        detail: "Current exposure is elevated across multiple categories.",
      };
    }
    if (level === "Low") {
      return {
        label: "Stable posture",
        Icon: TrendingDown,
        tone: "text-emerald-400",
        detail: "Risk indicators are within an acceptable range institution-wide.",
      };
    }
    return {
      label: "Holding steady",
      Icon: Minus,
      tone: "text-amber-400",
      detail: "Some categories need continued monitoring to stay on track.",
    };
  }, [riskData, result]);

  const complianceRecommendation = useMemo(() => {
    const score = result?.compliance_score ?? 0;
    if (score >= 85) {
      return "Maintain current controls and schedule the next periodic review to confirm continued alignment.";
    }
    if (score >= 60) {
      return "Prioritize remediation of partially implemented controls to move the score into the strong range.";
    }
    return "Immediate remediation is recommended, starting with the critical gaps identified below.";
  }, [result]);

  const kpiCards = [
    {
      label: "Compliance Score",
      value: `${result?.compliance_score ?? 0}%`,
      icon: Gauge,
      accent: "from-cyan-500 to-blue-600",
    },
    {
      label: "Overall Risk Score",
      value: riskData?.overall_risk_score?.toFixed(1) ?? "—",
      icon: ShieldAlert,
      accent: "from-red-600 to-rose-600",
    },
    {
      label: "Risk Level",
      value: riskData?.overall_risk_level ?? "—",
      icon: AlertTriangle,
      accent: "from-amber-500 to-orange-600",
    },
    {
      label: "Assessment Status",
      value: result?.status ?? "—",
      icon: ClipboardList,
      accent: "from-indigo-600 to-blue-600",
    },
    {
      label: "Documents Reviewed",
      value: result?.documents_reviewed ?? 0,
      icon: FileText,
      accent: "from-slate-600 to-slate-800",
    },
    {
      label: "Controls Implemented",
      value: result?.implemented_count ?? 0,
      icon: CheckCircle2,
      accent: "from-emerald-600 to-teal-600",
    },
  ];

  const controlsSummary = [
    {
      label: "Implemented",
      value: result?.implemented_count || 0,
      icon: CheckCircle2,
      text: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-400/20",
      dot: "bg-emerald-400",
    },
    {
      label: "Partially Implemented",
      value: result?.partial_count || 0,
      icon: Layers,
      text: "text-amber-300",
      bg: "bg-amber-500/10",
      border: "border-amber-400/20",
      dot: "bg-amber-400",
    },
    {
      label: "Not Implemented",
      value: result?.not_implemented_count || 0,
      icon: ShieldAlert,
      text: "text-red-300",
      bg: "bg-red-500/10",
      border: "border-red-400/20",
      dot: "bg-red-400",
    },
    {
      label: "N/A",
      value: result?.na_count || 0,
      icon: CircleSlash,
      text: "text-slate-400",
      bg: "bg-white/[0.03]",
      border: "border-white/10",
      dot: "bg-slate-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#020817] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-9 h-9 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-500 tracking-wide">
            Compiling institutional risk report…
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen w-full bg-[#020817] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">Report unavailable</p>
            <p className="text-sm text-red-300">{loadError}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-[#020817] text-sm font-semibold shadow-[0_0_20px_-6px_rgba(34,211,238,0.7)] hover:bg-cyan-300 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#020817] text-slate-200 flex font-sans antialiased">
      {downloading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-[#0B1120] border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
            <p className="font-semibold text-white">Generating PDF Report...</p>
            <p className="text-sm text-slate-500">
              Please wait while the report is being created.
            </p>
          </div>
        </div>
      )}

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
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                  {result?.university_name || "Institutional"} Risk Posture Summary
                </h1>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Generated {result?.generated_at || "just now"} · Assessment #{assessmentId}
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div
                className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} text-xs font-semibold`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.ring }} />
                {theme.label}
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 flex items-center justify-center font-semibold text-xs">
                {getInitials("Security Admin")}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 space-y-6">
          {/* High-risk alert banner */}
          {theme.banner && (
            <div
              className={`rounded-2xl border px-5 py-3 flex items-center justify-center gap-2.5 ${theme.banner.bg} ${
                theme.banner.pulse ? "animate-pulse" : ""
              }`}
            >
              <ShieldAlert className={`w-5 h-5 ${theme.banner.icon}`} />
              <p className={`text-sm font-semibold ${theme.banner.text}`}>
                {result?.risk_level === "High"
                  ? "Critical risk exposure detected — immediate remediation recommended."
                  : "Elevated risk factors identified — review recommended remediation items."}
              </p>
            </div>
          )}

          {/* ================= HERO ================= */}
          <section className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden p-6 sm:p-8">
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />
            <div
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ backgroundColor: theme.ring }}
            />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2.5 mb-4"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400/70">
                  Executive Compliance Report
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} font-semibold text-sm`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.ring }} />
                    {theme.label}
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-semibold text-sm ${
                      isPending
                        ? "bg-amber-400/10 border-amber-300/30 text-amber-200"
                        : "bg-emerald-400/10 border-emerald-300/30 text-emerald-200"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isPending ? "bg-amber-400" : "bg-emerald-400"}`} />
                    {result?.status || "Status unknown"}
                  </div>
                </div>
              </motion.div>

              {/* Twin hero cards: compliance ring + risk score */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8"
              >
                {/* Compliance score — glass card */}
                <div className="lg:col-span-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] px-8 py-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-52 h-52 shrink-0">
                    <svg viewBox="0 0 280 280" className="w-full h-full -rotate-90">
                      <circle cx="140" cy="140" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="20" />
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
                      <span className="font-mono text-5xl font-bold text-white">{animatedScore}</span>
                      <span className="text-[11px] font-semibold text-slate-500 tracking-wide mt-1">
                        COMPLIANCE SCORE
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <h2 className="text-lg font-bold text-white mb-2">Overall Governance Assessment</h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      {result?.summary ||
                        "This institution's cybersecurity and AI governance posture has been evaluated across access control, data protection, AI governance, and incident response domains."}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3">
                        <p className="font-mono text-lg font-bold text-white">{implementedControls.length}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Controls Met</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3">
                        <p className="font-mono text-lg font-bold text-white">{criticalGaps.length}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Gaps Found</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk score — glass card */}
                <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] px-8 py-8 flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center justify-center">
                      <Gauge className="w-4.5 h-4.5 text-red-300" />
                    </div>
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-500">
                      Overall Risk Score
                    </span>
                  </div>

                  <div className="mt-6">
                    <span className="font-mono text-6xl font-bold text-white">
                      {riskData?.overall_risk_score?.toFixed(1) ?? "—"}
                    </span>
                    <span className="text-slate-500 text-lg font-medium"> /100</span>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <trendCopy.Icon className={`w-4 h-4 ${trendCopy.tone}`} />
                    <p className="text-sm text-slate-400">{trendCopy.label}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ================= KPI STRIP ================= */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {kpiCards.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={kpi.label}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl p-4 flex flex-col gap-3"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.accent} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-4.5 h-4.5 text-white" strokeWidth={2.25} />
                  </div>
                  <div>
                    <p className="font-mono text-xl font-bold text-white truncate">{kpi.value}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-tight">{kpi.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.section>

          {/* ================= CATEGORY RISK ANALYSIS ================= */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-white text-sm">Category Risk Analysis</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Risk score by governance category · lower is better
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Low
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Medium
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> High
                </span>
              </div>
            </div>

            {categoryRisks.length === 0 ? (
              <EmptyState message="Category risk breakdown will appear once scoring is complete." />
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(260, categoryRisks.length * 56)}>
                <BarChart
                  data={categoryRisks}
                  layout="vertical"
                  margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
                  barCategoryGap={18}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    width={160}
                    tick={{ fontSize: 13, fill: "#cbd5e1", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    contentStyle={{
                      background: "#0B1120",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      color: "#e2e8f0",
                    }}
                  />
                  <Bar dataKey="risk_score" radius={[0, 8, 8, 0]} barSize={20}>
                    {categoryRisks.map((entry, index) => (
                      <Cell key={`cat-cell-${index}`} fill={riskBarColor(entry.risk_score ?? 0)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.section>

          {/* ================= COMPLIANCE DISTRIBUTION ================= */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8"
          >
            <h3 className="font-semibold text-white text-sm mb-1">Compliance Distribution</h3>
            <p className="text-xs text-slate-500 mb-6">Control implementation status across the assessment</p>

            {complianceTotal === 0 ? (
              <EmptyState message="Distribution will populate once controls have been evaluated." />
            ) : (
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative w-full max-w-[280px] h-[280px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={complianceChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={78}
                        outerRadius={118}
                        paddingAngle={2}
                        cornerRadius={6}
                        stroke="none"
                      >
                        {complianceChartData.map((entry) => (
                          <Cell key={entry.name} fill={COMPLIANCE_COLORS[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#0B1120",
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.1)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                          color: "#e2e8f0",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-mono text-4xl font-bold text-white">{implementedPercent}%</span>
                    <span className="text-[11px] font-semibold text-slate-500 tracking-wide mt-1">
                      IMPLEMENTED
                    </span>
                  </div>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {complianceChartData.map((entry) => {
                    const pct = complianceTotal ? Math.round((entry.value / complianceTotal) * 100) : 0;
                    return (
                      <div
                        key={entry.name}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: COMPLIANCE_COLORS[entry.name] }}
                          />
                          <span className="text-sm font-medium text-slate-300">{entry.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white font-mono">{entry.value}</p>
                          <p className="text-[11px] text-slate-500">{pct}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.section>

          {/* ================= RISK INSIGHTS ================= */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold text-white text-sm mb-4">Risk Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InsightCard
                icon={AlertTriangle}
                iconBg="bg-red-500/10 border-red-400/20"
                iconColor="text-red-400"
                label="Highest Risk Category"
                value={highestRiskCategory?.category || "—"}
                detail={highestRiskCategory ? `Score ${highestRiskCategory.risk_score}` : "No category data yet"}
              />
              <InsightCard
                icon={ShieldCheck}
                iconBg="bg-emerald-500/10 border-emerald-400/20"
                iconColor="text-emerald-400"
                label="Lowest Risk Category"
                value={lowestRiskCategory?.category || "—"}
                detail={lowestRiskCategory ? `Score ${lowestRiskCategory.risk_score}` : "No category data yet"}
              />
              <InsightCard
                icon={trendCopy.Icon}
                iconBg="bg-cyan-500/10 border-cyan-400/20"
                iconColor="text-cyan-300"
                label="Overall Risk Trend"
                value={trendCopy.label}
                detail={trendCopy.detail}
              />
              <InsightCard
                icon={Sparkles}
                iconBg="bg-indigo-500/10 border-indigo-400/20"
                iconColor="text-indigo-300"
                label="Recommendation"
                value="Next step"
                detail={complianceRecommendation}
              />
            </div>
          </motion.section>

          {/* ================= CONTROLS SUMMARY ================= */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold text-white text-sm mb-4">Controls Summary</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {controlsSummary.map((c) => {
                const Icon = c.icon;
                return (
                  <motion.div
                    key={c.label}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`rounded-2xl border ${c.border} ${c.bg} p-5`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`w-5 h-5 ${c.text}`} />
                      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                    </div>
                    <p className={`font-mono text-2xl font-bold ${c.text}`}>{c.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{c.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* ================= EXECUTIVE SUMMARY PANEL ================= */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden"
          >
            <div className="bg-white/[0.02] border-b border-white/[0.06] px-6 sm:px-8 py-5 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white text-sm">Executive Summary</h3>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Overall Compliance Posture
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {result?.summary ||
                    `This institution scored ${result?.compliance_score ?? 0}% on compliance with an overall risk level of ${
                      riskData?.overall_risk_level || result?.risk_level || "unassessed"
                    }. ${implementedControls.length} controls are met and ${criticalGaps.length} gaps remain outstanding.`}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Key Findings</p>
                {criticalGaps.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No critical findings recorded.</p>
                ) : (
                  <ul className="space-y-2">
                    {criticalGaps.slice(0, 4).map((gap, index) => (
                      <li key={gap.id || index} className="flex items-start gap-2 text-sm text-slate-400">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-1" />
                        <span>{gap.title || gap.question_text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Recommended Actions
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-1" />
                    <span>{complianceRecommendation}</span>
                  </li>
                  {criticalGaps.slice(0, 3).map((gap, index) => (
                    <li key={`action-${gap.id || index}`} className="flex items-start gap-2 text-sm text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-1" />
                      <span>Remediate: {gap.title || gap.question_text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* ================= ASSESSMENT VERIFICATION ================= */}
          {verificationType && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold text-white text-sm">Assessment Verification</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Result Source: <span className="font-medium text-slate-200">{verificationType}</span>
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${verificationBadgeStyles[verificationBadge]}`}>
                  {verificationBadge}
                </span>

                {verificationBadge === "Optional" && (
                  <button
                    onClick={() => navigate("/assessment/questionnaire", { state: { assessmentId } })}
                    className="px-4 py-2 rounded-xl bg-cyan-400 text-[#020817] text-sm font-semibold shadow-[0_0_20px_-6px_rgba(34,211,238,0.7)] hover:bg-cyan-300 transition-all duration-200"
                  >
                    Complete Questionnaire Verification
                  </button>
                )}

                {verificationBadge === "Pending" && (
                  <button
                    onClick={() => navigate("/upload-assessment", { state: { assessmentId } })}
                    className="px-4 py-2 rounded-xl bg-cyan-400 text-[#020817] text-sm font-semibold shadow-[0_0_20px_-6px_rgba(34,211,238,0.7)] hover:bg-cyan-300 transition-all duration-200"
                  >
                    Upload Verification Documents
                  </button>
                )}
              </div>
            </motion.section>
          )}

          {/* ================= ASSESSMENT STATUS ================= */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-semibold text-white text-sm">Assessment Status</h3>
              <p className="text-sm text-slate-400 mt-1">
                {questionnaireCompleted && !documentCompleted && "Upload documents to complete verification."}
                {!questionnaireCompleted && documentCompleted && "Complete questionnaire verification."}
                {questionnaireCompleted && documentCompleted && "Assessment verification completed."}
              </p>
            </div>

            <button
              onClick={() => {
                if (questionnaireCompleted && !documentCompleted) {
                  navigate("/upload-assessment", { state: { assessmentId } });
                } else if (!questionnaireCompleted && documentCompleted) {
                  navigate("/assessment/questionnaire", { state: { assessmentId } });
                }
              }}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.03] ${
                result?.status === "Pending"
                  ? "bg-amber-500/10 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/20"
              }`}
            >
              {questionnaireCompleted && !documentCompleted && "Upload Documents"}
              {!questionnaireCompleted && documentCompleted && "Complete Questionnaire"}
              {questionnaireCompleted && documentCompleted && "Completed"}
            </button>
          </motion.section>

          {/* ================= IMPLEMENTED VS GAPS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Implemented Controls */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">Implemented Controls</h3>
              </div>

              <div className="space-y-3">
                {implementedControls.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No verified controls recorded yet.</p>
                )}
                {implementedControls.map((control, index) => (
                  <div
                    key={control.id || index}
                    className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.04] px-4 py-3 transition-all duration-300 hover:border-emerald-400/40"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{control.title || control.question_text}</p>
                      {control.category && (
                        <p className="text-xs text-slate-500 font-mono mt-0.5 uppercase tracking-wide">
                          {control.category}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Critical Gaps */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-400/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">Critical Security Gaps</h3>
              </div>

              <div className="space-y-3">
                {criticalGaps.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No critical gaps identified.</p>
                )}
                {criticalGaps.map((gap, index) => (
                  <div
                    key={gap.id || index}
                    className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.04] px-4 py-3 transition-all duration-300 hover:border-red-400/40"
                  >
                    <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{gap.title || gap.question_text}</p>
                      {gap.category && (
                        <p className="text-xs text-slate-500 font-mono mt-0.5 uppercase tracking-wide">
                          {gap.category}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to dashboard
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/assessment/questionnaire", { state: { assessmentId } })}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-300 bg-white/[0.03] border border-white/[0.08] transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20"
              >
                <RefreshCcw className="w-4 h-4" />
                Reassess
              </button>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-[#020817] bg-cyan-400 shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] transition-all duration-200 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Full Report
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, iconBg, iconColor, label, value, detail }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl p-5"
    >
      <div className={`w-9 h-9 rounded-xl border ${iconBg} flex items-center justify-center mb-4`}>
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-base font-bold text-white mt-1 truncate">{value}</p>
      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{detail}</p>
    </motion.div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14">
      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3">
        <Layers className="w-5 h-5 text-slate-500" />
      </div>
      <p className="text-sm text-slate-500 max-w-xs">{message}</p>
    </div>
  );
}