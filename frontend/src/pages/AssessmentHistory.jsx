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
  Bell,
  Menu,
  X,
  ShieldAlert,
  ClipboardList,
  Inbox,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronRightIcon,
  Filter,
  Calendar,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ------------------------------------------------------------------ */
/*  Same nav + token/color system as SecurityCommandCenter.jsx, so     */
/*  this page reads as the same product rather than a bolted-on one.   */
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

const RISK_STYLES = {
  High: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", dot: "bg-red-500" },
  Medium: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-500" },
  Low: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", dot: "bg-emerald-500" },
  Unknown: { text: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30", dot: "bg-slate-500" },
};

const STATUS_STYLES = {
  Completed: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", dot: "bg-emerald-500" },
  Pending: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-500" },
  Failed: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", dot: "bg-red-500" },
  Unknown: { text: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30", dot: "bg-slate-500" },
};

const RISK_FILTERS = ["All", "High", "Medium", "Low"];
const PAGE_SIZE = 8;

function formatDate(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

// No more hardcoded UNIVERSITIES lookup table — the institution name comes
// straight off the record. Checks a few likely field names so this keeps
// working whichever one the API actually sends, and falls back to the id
// only if the backend hasn't been updated to include a name yet.
function getInstitutionName(item) {
  return (
    item.university_name ||
    item.institution_name ||
    item.university ||
    (item.university_id != null ? `Institution #${item.university_id}` : "Unknown Institution")
  );
}

export default function AssessmentHistory() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [historyResponse, setHistoryResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard`, {
        headers: authHeaders(),
      });
      setHistoryResponse(response.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(
        err?.response?.data?.message ||
          "Unable to load assessment history right now. Please try again."
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
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const history = historyResponse?.history ?? [];

  const riskCounts = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    history.forEach((item) => {
      const level = item.risk_level;
      if (level && counts[level] !== undefined) counts[level] += 1;
    });
    return counts;
  }, [history]);

  const totalAssessments = historyResponse?.total_assessments ?? history.length;

  const summaryCards = [
    {
      label: "Total Assessments",
      value: totalAssessments,
      icon: ClipboardList,
      glow: "rgba(34,211,238,0.45)",
      ring: "border-cyan-400/20",
      trend: `${history.length} on record`,
      trendUp: true,
    },
    {
      label: "High Risk Assessments",
      value: riskCounts.High,
      icon: AlertTriangle,
      glow: "rgba(248,113,113,0.45)",
      ring: "border-red-400/20",
      trend: riskCounts.High > 0 ? "Needs attention" : "All clear",
      trendUp: riskCounts.High === 0,
    },
    {
      label: "Medium Risk Assessments",
      value: riskCounts.Medium,
      icon: ShieldAlert,
      glow: "rgba(245,158,11,0.4)",
      ring: "border-amber-400/20",
      trend: "Under review",
      trendUp: true,
    },
    {
      label: "Low Risk Assessments",
      value: riskCounts.Low,
      icon: ShieldCheck,
      glow: "rgba(16,185,129,0.4)",
      ring: "border-emerald-400/20",
      trend: "Within tolerance",
      trendUp: true,
    },
  ];

  const filteredHistory = useMemo(() => {
    let rows = history;

    if (riskFilter !== "All") {
      rows = rows.filter((item) => (item.risk_level || "Unknown") === riskFilter);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter((item) => {
        const name = getInstitutionName(item).toLowerCase();
        return (
          String(item.assessment_id).includes(q) ||
          String(item.university_id).includes(q) ||
          name.includes(q)
        );
      });
    }

    return rows;
  }, [history, riskFilter, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, riskFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedHistory = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredHistory.slice(start, start + PAGE_SIZE);
  }, [filteredHistory, safePage]);

  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  const goToResult = (assessmentId) => {
    navigate("/assessment/result", { state: { assessmentId } });
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
              <p className="font-semibold tracking-wide text-sm text-white leading-tight">CommandCenter</p>
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
                      <Icon className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300"}`} strokeWidth={2} />
                      {item.label}
                      {isActive && <ChevronRightIcon className="w-3.5 h-3.5 ml-auto text-cyan-400/70" />}
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
        <header className="sticky top-0 z-20 bg-[#0B1120]/85 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center gap-4 px-4 sm:px-8 py-4">
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden sm:block min-w-0">
              <p className="text-sm text-slate-500">
                Welcome back,{" "}
                <span className="font-semibold text-white">{historyResponse?.user || "…"}</span>
              </p>
            </div>

            <div className="flex-1 max-w-md ml-auto relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assessments, institutions…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40"
              />
            </div>

            <button className="relative w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] transition-all duration-200">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0B1120]" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 flex items-center justify-center font-semibold text-xs">
              {getInitials(historyResponse?.user)}
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
                onClick={fetchHistory}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-300 hover:text-red-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {/* HERO */}
          <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10">
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-xl">
                <p className="uppercase tracking-[0.2em] text-xs font-semibold text-cyan-400/80 font-mono mb-3">
                  Assessment Records
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3 text-white">
                  Assessment History
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Complete record of all institutional risk assessments.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 border border-white/10 bg-white/[0.03] hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] text-slate-200 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowLeft className="w-4 h-4 text-cyan-400" />
                  Back to Dashboard
                </button>
                <button
                  onClick={fetchHistory}
                  disabled={isLoading}
                  className="flex items-center gap-2 border border-white/10 bg-white/[0.03] hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] text-slate-200 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 text-cyan-400 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh History
                </button>
              </div>
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 animate-pulse">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.06] mb-5" />
                    <div className="h-3 w-24 bg-white/[0.06] rounded mb-3" />
                    <div className="h-7 w-16 bg-white/[0.06] rounded" />
                  </div>
                ))
              : summaryCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className={`rounded-2xl border ${card.ring} bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 40px -12px ${card.glow}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 0px 0 transparent";
                      }}
                    >
                      <div className="flex items-start justify-between mb-5">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center border"
                          style={{
                            background: card.glow.replace(/[\d.]+\)$/, "0.12)"),
                            borderColor: card.glow.replace(/[\d.]+\)$/, "0.3)"),
                          }}
                        >
                          <Icon className="w-5 h-5 text-white" strokeWidth={2.25} />
                        </div>
                      </div>
                      <p className="text-xs font-medium text-slate-400 tracking-wide">{card.label}</p>
                      <p className="text-2xl font-bold text-white mt-1.5 font-mono">{card.value}</p>
                      <p className={`text-xs mt-2 ${card.trendUp ? "text-emerald-400" : "text-red-400"}`}>
                        {card.trend}
                      </p>
                    </motion.div>
                  );
                })}
          </section>

          {/* SEARCH & FILTERS */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <Filter className="w-4.5 h-4.5 text-cyan-400/70" />
              <h3 className="font-semibold text-white text-sm">Search &amp; Filters</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="relative lg:col-span-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Assessment ID or Institution…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:col-span-1">
                {RISK_FILTERS.map((level) => {
                  const isActive = riskFilter === level;
                  const style = level !== "All" ? RISK_STYLES[level] : null;
                  return (
                    <button
                      key={level}
                      onClick={() => setRiskFilter(level)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        isActive
                          ? "bg-cyan-400/10 text-cyan-300 border-cyan-400/30"
                          : "bg-white/[0.02] text-slate-400 border-white/10 hover:border-cyan-400/20 hover:text-slate-200"
                      }`}
                    >
                      {style && (
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-cyan-400" : style.dot}`} />
                      )}
                      {level}
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-1">
                <button
                  type="button"
                  disabled
                  title="Date range filtering is coming soon"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-slate-500 cursor-not-allowed"
                >
                  <Calendar className="w-4 h-4" />
                  Date range · Coming soon
                </button>
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div>
                <h3 className="font-semibold text-white text-sm">All Assessments</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {filteredHistory.length} of {history.length} assessment{history.length === 1 ? "" : "s"} shown
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-white/[0.04] animate-pulse" />
                ))}
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                  <Inbox className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-sm font-semibold text-slate-200">No assessments found</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {searchQuery || riskFilter !== "All"
                    ? "Try a different search term or filter."
                    : "Once assessments are submitted, they'll appear here."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-white/[0.06] font-mono">
                        <th className="px-6 py-3 font-medium">Assessment ID</th>
                        <th className="px-6 py-3 font-medium">Institution</th>
                        <th className="px-6 py-3 font-medium">Compliance Score</th>
                        <th className="px-6 py-3 font-medium">Risk Level</th>
                        <th className="px-6 py-3 font-medium">Submitted Date</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium" />
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedHistory.map((item) => {
                        const level = item.risk_level || "Unknown";
                        const riskStyle = RISK_STYLES[level] || RISK_STYLES.Unknown;
                        const status = item.status || "Unknown";
                        const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.Unknown;

                        return (
                          <tr
                            key={item.assessment_id}
                            onClick={() => goToResult(item.assessment_id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") goToResult(item.assessment_id);
                            }}
                            className="group cursor-pointer border-b border-white/[0.04] last:border-0 hover:bg-cyan-400/[0.04] transition-colors duration-150"
                          >
                            <td className="px-6 py-4 font-medium text-slate-200 font-mono">
                              #{item.assessment_id}
                            </td>
                            <td className="px-6 py-4 text-slate-400">{getInstitutionName(item)}</td>
                            <td className="px-6 py-4 text-slate-200 font-mono font-semibold">
                              {item.compliance_score != null ? `${item.compliance_score}%` : "—"}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${riskStyle.text} ${riskStyle.bg} ${riskStyle.border}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${riskStyle.dot}`} />
                                {level}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-mono">{formatDate(item.submitted_at)}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.text} ${statusStyle.bg} ${statusStyle.border}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-200 inline-block" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-white/[0.06]">
                  <p className="text-xs text-slate-500 font-mono">
                    Page {safePage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="hidden sm:flex items-center gap-1">
                      {pageNumbers.map((num) => (
                        <button
                          key={num}
                          onClick={() => setCurrentPage(num)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium font-mono transition-all duration-200 ${
                            num === safePage
                              ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/30"
                              : "text-slate-400 hover:bg-white/[0.04]"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}