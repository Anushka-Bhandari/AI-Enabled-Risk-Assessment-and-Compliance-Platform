import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ShieldCheck,
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
  ChevronRight,
  Gauge,
  FileCheck2,
  ShieldAlert,
  FileText,
  Loader2,
  Download,
  FileSpreadsheet,
  FileOutput,
  TrendingUp,
  CheckCircle2,
  Clock,
  BellRing,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ------------------------------------------------------------------ */
/*  Design tokens — matches the rest of the platform                   */
/*  bg-deep   #020817   page background                                */
/*  bg-panel  #0B1120   sidebar / header                                */
/*  bg-card   #111827   card surfaces                                   */
/*  accent    cyan  #22D3EE   primary glow / signature                  */
/* ------------------------------------------------------------------ */

const NAV_SECTIONS = [
  {
    section: "OPERATIONS",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/SecurityCommandCenter" },
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

const RISK_PILL_STYLES = {
  Low: "text-emerald-300 bg-emerald-500/10 border-emerald-400/30",
  Medium: "text-amber-300 bg-amber-500/10 border-amber-400/30",
  High: "text-red-300 bg-red-500/10 border-red-400/30",
};

// Section 1 — Compliance Overview. Wired to the same /dashboard +
// /dashboard/analytics endpoints as SecurityCommandCenter, so
// Assessments Completed, Compliance Score, High Risk Findings and
// Reports Generated reflect real data once loaded. fallbackValue is
// only shown while loading / if a field is absent from the payload.
const OVERVIEW_META = [
  { key: "complianceScore", label: "Overall Compliance Score", icon: Gauge, glow: "rgba(34,211,238,0.45)", ring: "border-cyan-400/20", fallbackValue: "88%" },
  { key: "assessmentsCompleted", label: "Assessments Completed", icon: FileCheck2, glow: "rgba(16,185,129,0.4)", ring: "border-emerald-400/20", fallbackValue: "42" },
  { key: "highRiskFindings", label: "High Risk Findings", icon: ShieldAlert, glow: "rgba(248,113,113,0.45)", ring: "border-red-400/20", fallbackValue: "3" },
  { key: "reportsGenerated", label: "Reports Generated", icon: FileText, glow: "rgba(250,204,21,0.4)", ring: "border-yellow-400/20", fallbackValue: "18" },
];

// Section 2 — Department Compliance. No per-department endpoint exists
// yet, so this is illustrative data — swap in a real fetch once the
// backend exposes department-level scoring.
const DEPARTMENT_COMPLIANCE = [
  { department: "Computer Science", score: 92, risk: "Low" },
  { department: "Information Technology", score: 88, risk: "Low" },
  { department: "Electronics & Comm.", score: 75, risk: "Medium" },
  { department: "Mechanical Engineering", score: 62, risk: "High" },
  { department: "Finance", score: 71, risk: "Medium" },
  { department: "Registrar's Office", score: 95, risk: "Low" },
];

// Section 3 — Assessment History Trend. Mock monthly series until the
// backend exposes a historical compliance-score timeseries endpoint.
const COMPLIANCE_TREND = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 76 },
  { month: "Mar", score: 81 },
  { month: "Apr", score: 85 },
  { month: "May", score: 88 },
  { month: "Jun", score: 87 },
  { month: "Jul", score: 90 },
];

// Section 4 — Risk Findings Summary. Illustrative until wired to the
// aggregated critical_gaps / partial-control data across assessments.
const RISK_FINDINGS = {
  High: [
    "Missing MFA policy on faculty accounts",
    "Weak password complexity controls",
    "Incomplete audit logging on file access",
  ],
  Medium: [
    "Outdated data retention documentation",
    "Missing annual security awareness training",
    "Legacy VPN configuration not reviewed",
  ],
};

// Section 6 — Monitoring + Assessment fusion. Illustrative until the
// alerts pipeline exposes a monthly resolution-time aggregate.
const MONITORING_FUSION = [
  { key: "alertsThisMonth", label: "Security Alerts This Month", value: "37", icon: BellRing, accent: "text-cyan-300" },
  { key: "resolvedAlerts", label: "Resolved Alerts", value: "34", icon: CheckCircle2, accent: "text-emerald-300" },
  { key: "avgResolution", label: "Avg. Resolution Time", value: "2.1 hrs", icon: Clock, accent: "text-amber-300" },
  { key: "complianceImpact", label: "Compliance Impact Score", value: "88%", icon: TrendingUp, accent: "text-indigo-300" },
];

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function ComplianceReports() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(null); // "pdf" | "executive" | "csv" | null
  const [generateError, setGenerateError] = useState("");

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const [dashboardRes, analyticsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/dashboard`, { headers: authHeaders() }),
        axios.get(`${API_BASE_URL}/dashboard/analytics`, { headers: authHeaders() }),
      ]);

      setDashboardData(dashboardRes.data);
      setAnalyticsData(analyticsRes.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(
        err?.response?.data?.message ||
          "Unable to load compliance report data right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const riskCounts = useMemo(
    () => analyticsData?.risk_breakdown ?? { High: 0, Medium: 0, Low: 0 },
    [analyticsData]
  );
  const totalAssessments = analyticsData?.total_assessments ?? dashboardData?.total_assessments ?? 0;
  const complianceScore = analyticsData?.compliance_score ?? null;
  const reportsGenerated = Math.max(totalAssessments - riskCounts.High, 0);

  const overviewCards = useMemo(
    () =>
      OVERVIEW_META.map((meta) => {
        if (meta.key === "complianceScore" && complianceScore !== null) {
          return { ...meta, value: `${complianceScore}%` };
        }
        if (meta.key === "assessmentsCompleted" && analyticsData) {
          return { ...meta, value: String(totalAssessments) };
        }
        if (meta.key === "highRiskFindings" && analyticsData) {
          return { ...meta, value: String(riskCounts.High ?? 0) };
        }
        if (meta.key === "reportsGenerated" && analyticsData) {
          return { ...meta, value: String(reportsGenerated) };
        }
        return { ...meta, value: meta.fallbackValue };
      }),
    [analyticsData, totalAssessments, complianceScore, riskCounts, reportsGenerated]
  );

  const handleGenerate = async (type) => {
    setGenerating(type);
    setGenerateError("");
    try {
      const endpoints = {
        pdf: "/reports/compliance/pdf",
        executive: "/reports/compliance/executive-summary",
        csv: "/reports/compliance/csv",
      };

      const response = await axios.get(`${API_BASE_URL}${endpoints[type]}`, {
        headers: authHeaders(),
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const extensions = { pdf: "pdf", executive: "pdf", csv: "csv" };
      link.download = `compliance-report-${type}.${extensions[type]}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setGenerateError(
        err?.response?.data?.message || "Unable to generate the report right now. Please try again."
      );
    } finally {
      setGenerating(null);
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
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
                <FileBarChart2 className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                  Compliance Reports
                </h1>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Executive view · assessment + monitoring history
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 flex items-center justify-center font-semibold text-xs">
                {getInitials(dashboardData?.user || "Security Admin")}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 space-y-6">
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-300">{error}</p>
              </div>
              <button
                onClick={fetchOverview}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-300 hover:text-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* ================= SECTION 1 — COMPLIANCE OVERVIEW ================= */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-white text-sm">Compliance Overview</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  How is the institution performing overall
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 animate-pulse">
                      <div className="w-11 h-11 rounded-xl bg-white/[0.06] mb-5" />
                      <div className="h-3 w-24 bg-white/[0.06] rounded mb-3" />
                      <div className="h-7 w-16 bg-white/[0.06] rounded" />
                    </div>
                  ))
                : overviewCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className={`relative rounded-2xl border ${card.ring} bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 40px -12px ${card.glow}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "0 0 0px 0 transparent";
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center border mb-5"
                          style={{
                            background: card.glow.replace(/[\d.]+\)$/, "0.12)"),
                            borderColor: card.glow.replace(/[\d.]+\)$/, "0.3)"),
                          }}
                        >
                          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                        <p className="text-xs font-medium text-slate-400 tracking-wide">{card.label}</p>
                        <p className="text-3xl font-bold text-white mt-1.5 font-mono">{card.value}</p>
                      </motion.div>
                    );
                  })}
            </div>
          </section>

          {/* ================= SECTION 2 — DEPARTMENT COMPLIANCE ================= */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div>
                <h3 className="font-semibold text-white text-sm">Department Compliance</h3>
                <p className="text-xs text-slate-500 mt-0.5">Compare compliance posture across departments</p>
              </div>
              <Building2 className="w-4.5 h-4.5 text-cyan-400/70" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-white/[0.06] font-mono">
                    <th className="px-6 py-3 font-medium">Department</th>
                    <th className="px-6 py-3 font-medium">Compliance Score</th>
                    <th className="px-6 py-3 font-medium">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {DEPARTMENT_COMPLIANCE.map((dept) => (
                    <tr
                      key={dept.department}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-medium text-slate-200">{dept.department}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-28 h-1.5 rounded-full bg-white/[0.06] overflow-hidden shrink-0">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${dept.score}%`,
                                backgroundColor:
                                  dept.risk === "Low" ? "#10B981" : dept.risk === "Medium" ? "#F59E0B" : "#DC2626",
                              }}
                            />
                          </div>
                          <span className="font-mono text-slate-300">{dept.score}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${RISK_PILL_STYLES[dept.risk]}`}
                        >
                          {dept.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ================= SECTION 3 — ASSESSMENT HISTORY TREND ================= */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-white text-sm">Compliance Score Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">Overall compliance score over time</p>
              </div>
              <TrendingUp className="w-4.5 h-4.5 text-emerald-400/70" />
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={COMPLIANCE_TREND}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0B1120",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#e2e8f0",
                  }}
                  formatter={(value) => [`${value}%`, "Compliance Score"]}
                />
                <Area type="monotone" dataKey="score" name="Compliance Score" stroke="#22D3EE" strokeWidth={2} fill="url(#trendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </section>

          {/* ================= SECTION 4 — RISK FINDINGS SUMMARY ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-red-400/20 bg-white/[0.03] backdrop-blur-xl p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-400/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">High Risk Findings</h3>
              </div>
              <ul className="space-y-3">
                {RISK_FINDINGS.High.map((finding) => (
                  <li key={finding} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-xl p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">Medium Risk Findings</h3>
              </div>
              <ul className="space-y-3">
                {RISK_FINDINGS.Medium.map((finding) => (
                  <li key={finding} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ================= SECTION 6 — MONITORING + ASSESSMENT FUSION ================= */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white text-sm">Monitoring + Assessment Fusion</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live security monitoring, rolled into your compliance picture
                </p>
              </div>
              <Radio className="w-4.5 h-4.5 text-cyan-400/70" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {MONITORING_FUSION.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.key} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <Icon className={`w-4.5 h-4.5 ${stat.accent} mb-3`} />
                    <p className="text-xl font-bold text-white font-mono leading-none">{stat.value}</p>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-tight">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================= SECTION 5 — DOWNLOAD REPORTS ================= */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white text-sm">Download Reports</h3>
                <p className="text-xs text-slate-500 mt-0.5">Export this view for board meetings or audits</p>
              </div>
              <FileOutput className="w-4.5 h-4.5 text-cyan-400/70" />
            </div>

            {generateError && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{generateError}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleGenerate("pdf")}
                disabled={generating !== null}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-[#020817] bg-cyan-400 shadow-[0_0_20px_-6px_rgba(34,211,238,0.7)] transition-all duration-200 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {generating === "pdf" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Generate PDF Report
              </button>

              <button
                onClick={() => handleGenerate("executive")}
                disabled={generating !== null}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-300 bg-white/[0.03] border border-white/[0.08] transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating === "executive" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                Generate Executive Summary
              </button>

              <button
                onClick={() => handleGenerate("csv")}
                disabled={generating !== null}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-300 bg-white/[0.03] border border-white/[0.08] transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating === "csv" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                Export CSV
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}