import React, { useEffect, useState, useMemo } from "react";
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
  const [riskData, setRiskData] = useState(null);

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
              Authorization: `Bearer ${token}`
            }
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
  const scorePercent = Math.min(100, Math.max(0, result?.compliance_score ?? 0));
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  const implementedControls = result?.implemented_controls || [];
  const criticalGaps = result?.critical_gaps || [];

  const isPending = result?.status === "Pending";

  const complianceChartData = [
    {
      name: "Implemented",
      value: result?.implemented_count || 0,
    },
    {
      name: "Partial",
      value: result?.partial_count || 0,
    },
    {
      name: "Not Implemented",
      value: result?.not_implemented_count || 0,
    },
    {
      name: "N/A",
      value: result?.na_count || 0,
    },
  ];

  // --- Presentation-only derived values (no new data sources, no changes
  // to result / riskData / assessmentId) ---------------------------------

  const COMPLIANCE_COLORS = {
    Implemented: "#10B981",
    Partial: "#F59E0B",
    "Not Implemented": "#DC2626",
    "N/A": "#94A3B8",
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

  const trendCopy = useMemo(() => {
    const level = riskData?.overall_risk_level || result?.risk_level;
    if (level === "High") {
      return {
        label: "Requires attention",
        Icon: TrendingUp,
        tone: "text-red-600",
        detail: "Current exposure is elevated across multiple categories.",
      };
    }
    if (level === "Low") {
      return {
        label: "Stable posture",
        Icon: TrendingDown,
        tone: "text-emerald-600",
        detail: "Risk indicators are within an acceptable range institution-wide.",
      };
    }
    return {
      label: "Holding steady",
      Icon: Minus,
      tone: "text-amber-600",
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
      accent: "from-[#0B2A66] to-blue-700",
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
      accent: "from-slate-700 to-slate-900",
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
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    {
      label: "Partially Implemented",
      value: result?.partial_count || 0,
      icon: Layers,
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    {
      label: "Not Implemented",
      value: result?.not_implemented_count || 0,
      icon: ShieldAlert,
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    {
      label: "N/A",
      value: result?.na_count || 0,
      icon: CircleSlash,
      text: "text-slate-600",
      bg: "bg-slate-50",
      border: "border-slate-200",
      dot: "bg-slate-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#0B2A66]/10 blur-xl animate-pulse" />
            <Loader2 className="relative w-9 h-9 text-[#0B2A66] animate-spin" />
          </div>
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
          className={`w-full border-b px-6 py-3 flex items-center justify-center gap-2.5 ${theme.banner.bg
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

      {/* ================= HERO ================= */}
      <div className="relative bg-[#0B2A66] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: theme.ring }}
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-24">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5 mb-4"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-200/80">
              Executive Compliance Report
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              {result?.university_name || "Institutional"} Risk Posture Summary
            </h1>
            <p className="text-blue-100/70 text-sm mt-2">
              Generated {result?.generated_at || "just now"} · Assessment #
              {assessmentId}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} font-semibold text-sm`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.ring }}
                />
                {theme.label}
              </div>

              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-semibold text-sm ${isPending
                    ? "bg-amber-400/10 border-amber-300/30 text-amber-200"
                    : "bg-emerald-400/10 border-emerald-300/30 text-emerald-200"
                  }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isPending ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                />
                {result?.status || "Status unknown"}
              </div>
            </div>
          </motion.div>

          {/* Twin hero cards: compliance ring + risk score */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-10"
          >
            {/* Compliance score — glass card */}
            <div className="lg:col-span-3 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 px-8 py-8 flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-52 h-52 shrink-0">
                <svg viewBox="0 0 280 280" className="w-full h-full -rotate-90">
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
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
                  <span className="font-mono text-5xl font-bold text-white">
                    {animatedScore}
                  </span>
                  <span className="text-[11px] font-semibold text-blue-200/70 tracking-wide mt-1">
                    COMPLIANCE SCORE
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full">
                <h2 className="text-lg font-bold text-white mb-2">
                  Overall Governance Assessment
                </h2>
                <p className="text-sm text-blue-100/70 leading-relaxed mb-6">
                  {result?.summary ||
                    "This institution's cybersecurity and AI governance posture has been evaluated across access control, data protection, AI governance, and incident response domains."}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
                    <p className="font-mono text-lg font-bold text-white">
                      {implementedControls.length}
                    </p>
                    <p className="text-xs text-blue-200/70 mt-0.5">Controls Met</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
                    <p className="font-mono text-lg font-bold text-white">
                      {criticalGaps.length}
                    </p>
                    <p className="text-xs text-blue-200/70 mt-0.5">Gaps Found</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk score — glass card */}
            <div className="lg:col-span-2 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 px-8 py-8 flex flex-col justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                  <Gauge className="w-4.5 h-4.5 text-red-300" />
                </div>
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-blue-200/70">
                  Overall Risk Score
                </span>
              </div>

              <div className="mt-6">
                <span className="font-mono text-6xl font-bold text-white">
                  {riskData?.overall_risk_score?.toFixed(1) ?? "—"}
                </span>
                <span className="text-blue-200/60 text-lg font-medium"> /100</span>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <trendCopy.Icon className="w-4 h-4 text-blue-200/80" />
                <p className="text-sm text-blue-100/80">{trendCopy.label}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= KPI STRIP ================= */}
      <div className="max-w-7xl mx-auto px-6 -mt-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-2xl bg-white border border-slate-200/70 shadow-lg shadow-slate-900/5 p-4 flex flex-col gap-3"
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.accent} flex items-center justify-center shadow-sm`}
                >
                  <Icon className="w-4.5 h-4.5 text-white" strokeWidth={2.25} />
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-slate-900 truncate">
                    {kpi.value}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-tight">
                    {kpi.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ================= CATEGORY RISK ANALYSIS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-white rounded-3xl shadow-xl border border-slate-200/70 p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Category Risk Analysis
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Risk score by governance category · lower is better
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" /> High
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
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={160}
                  tick={{ fontSize: 13, fill: "#334155", fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(11,42,102,0.04)" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
                />
                <Bar dataKey="risk_score" radius={[0, 8, 8, 0]} barSize={20}>
                  {categoryRisks.map((entry, index) => (
                    <Cell key={`cat-cell-${index}`} fill={riskBarColor(entry.risk_score ?? 0)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* ================= COMPLIANCE DISTRIBUTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-white rounded-3xl shadow-xl border border-slate-200/70 p-6 sm:p-8"
        >
          <h3 className="font-bold text-slate-900 text-lg mb-1">
            Compliance Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Control implementation status across the assessment
          </p>

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
                      contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-mono text-4xl font-bold text-slate-900">
                    {implementedPercent}%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 tracking-wide mt-1">
                    IMPLEMENTED
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                {complianceChartData.map((entry) => {
                  const pct = complianceTotal
                    ? Math.round((entry.value / complianceTotal) * 100)
                    : 0;
                  return (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: COMPLIANCE_COLORS[entry.name] }}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {entry.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 font-mono">
                          {entry.value}
                        </p>
                        <p className="text-[11px] text-slate-400">{pct}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* ================= RISK INSIGHTS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <h3 className="font-bold text-slate-900 text-lg mb-4">Risk Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InsightCard
              icon={AlertTriangle}
              iconBg="bg-red-50 border-red-100"
              iconColor="text-red-600"
              label="Highest Risk Category"
              value={highestRiskCategory?.category || "—"}
              detail={
                highestRiskCategory
                  ? `Score ${highestRiskCategory.risk_score}`
                  : "No category data yet"
              }
            />
            <InsightCard
              icon={ShieldCheck}
              iconBg="bg-emerald-50 border-emerald-100"
              iconColor="text-emerald-600"
              label="Lowest Risk Category"
              value={lowestRiskCategory?.category || "—"}
              detail={
                lowestRiskCategory
                  ? `Score ${lowestRiskCategory.risk_score}`
                  : "No category data yet"
              }
            />
            <InsightCard
              icon={trendCopy.Icon}
              iconBg="bg-blue-50 border-blue-100"
              iconColor="text-[#0B2A66]"
              label="Overall Risk Trend"
              value={trendCopy.label}
              detail={trendCopy.detail}
            />
            <InsightCard
              icon={Sparkles}
              iconBg="bg-indigo-50 border-indigo-100"
              iconColor="text-indigo-600"
              label="Recommendation"
              value="Next step"
              detail={complianceRecommendation}
            />
          </div>
        </motion.div>

        {/* ================= CONTROLS SUMMARY ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <h3 className="font-bold text-slate-900 text-lg mb-4">Controls Summary</h3>
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
        </motion.div>

        {/* ================= EXECUTIVE SUMMARY PANEL ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-3xl bg-white border border-slate-200/70 shadow-xl overflow-hidden"
        >
          <div className="bg-[#0B2A66] px-6 sm:px-8 py-5 flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white">Executive Summary</h3>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Overall Compliance Posture
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {result?.summary ||
                  `This institution scored ${result?.compliance_score ?? 0}% on compliance with an overall risk level of ${riskData?.overall_risk_level || result?.risk_level || "unassessed"}. ${implementedControls.length} controls are met and ${criticalGaps.length} gaps remain outstanding.`}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Key Findings
              </p>
              {criticalGaps.length === 0 ? (
                <p className="text-sm text-slate-400 italic">
                  No critical findings recorded.
                </p>
              ) : (
                <ul className="space-y-2">
                  {criticalGaps.slice(0, 4).map((gap, index) => (
                    <li
                      key={gap.id || index}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-1" />
                      <span>{gap.title || gap.question_text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Recommended Actions
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B2A66] shrink-0 mt-1" />
                  <span>{complianceRecommendation}</span>
                </li>
                {criticalGaps.slice(0, 3).map((gap, index) => (
                  <li
                    key={`action-${gap.id || index}`}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0B2A66] shrink-0 mt-1" />
                    <span>Remediate: {gap.title || gap.question_text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* ================= ASSESSMENT STATUS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-white rounded-3xl shadow-xl border border-slate-200/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Assessment Status
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Upload documents to complete verification.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/upload-assessment", {
                state: { assessmentId }
              })
            }
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.03] ${result?.status === "Pending"
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
          >
            {result?.status}
          </button>
        </motion.div>

        {/* ================= IMPLEMENTED VS GAPS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Implemented Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200/70 p-6"
          >
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
          </motion.div>

          {/* Critical Gaps */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200/70 p-6"
          >
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
          </motion.div>
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

function InsightCard({ icon: Icon, iconBg, iconColor, label, value, detail }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl bg-white border border-slate-200/70 shadow-lg shadow-slate-900/5 p-5"
    >
      <div className={`w-9 h-9 rounded-xl border ${iconBg} flex items-center justify-center mb-4`}>
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-base font-bold text-slate-900 mt-1 truncate">{value}</p>
      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{detail}</p>
    </motion.div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
        <Layers className="w-5 h-5 text-slate-400" />
      </div>
      <p className="text-sm text-slate-400 max-w-xs">{message}</p>
    </div>
  );
}