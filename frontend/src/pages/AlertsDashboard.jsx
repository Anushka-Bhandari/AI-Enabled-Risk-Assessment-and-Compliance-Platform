import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  ChevronLeft,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  Eye,
  Ban,
  Inbox,
  ArrowUpDown,
} from "lucide-react";
import { getAlerts, getAlertStats } from "../services/alertService";

/* ------------------------------------------------------------------ */
/*  Theme — as specified for the Alerts Management UI                   */
/*  bg-deep    #0B1220                                                  */
/*  bg-card    #111827                                                  */
/*  border     #1F2937                                                  */
/*  text       #F9FAFB                                                  */
/*  accent     #00E5FF                                                  */
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

const SEVERITY_STYLES = {
  CRITICAL: "text-red-400 bg-red-500/10 border-red-500/30",
  HIGH: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  MEDIUM: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  LOW: "text-blue-400 bg-blue-500/10 border-blue-500/30",
};

const SEVERITY_DOT = {
  CRITICAL: "bg-red-400",
  HIGH: "bg-orange-400",
  MEDIUM: "bg-yellow-400",
  LOW: "bg-blue-400",
};

const STATUS_STYLES = {
  OPEN: "text-red-400 bg-red-500/10 border-red-500/30",
  IN_PROGRESS: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  RESOLVED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  FALSE_POSITIVE: "text-slate-400 bg-slate-500/10 border-slate-500/30",
};

const STATUS_LABEL = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  FALSE_POSITIVE: "False Positive",
};

const SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "FALSE_POSITIVE"];
const PAGE_SIZE = 8;
const AUTO_REFRESH_MS = 10000;

function formatTimestamp(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function SeverityBadge({ severity }) {
  if (!severity) return <span className="text-[11px] text-slate-500">Unknown</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${SEVERITY_STYLES[severity] || "text-slate-400 bg-slate-500/10 border-slate-500/30"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[severity] || "bg-slate-400"}`} />
      {severity}
    </span>
  );
}

function StatusBadge({ status }) {
  if (!status) return <span className="text-[11px] text-slate-500">Unknown</span>;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${STATUS_STYLES[status] || "text-slate-400 bg-slate-500/10 border-slate-500/30"}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-start gap-3 px-5 py-4 rounded-xl border shadow-2xl backdrop-blur-xl max-w-sm ${isError ? "bg-red-500/10 border-red-500/30 text-red-200" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
        }`}
    >
      {isError ? <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5" />}
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={onDismiss} className="ml-auto text-current opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/[0.06] mb-4" />
      <div className="h-3 w-20 bg-white/[0.06] rounded mb-2" />
      <div className="h-6 w-12 bg-white/[0.06] rounded" />
    </div>
  );
}

export default function AlertsDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const fetchAll = useCallback(async ({ silent } = {}) => {
    if (silent) setIsRefreshing(true);
    else setIsLoading(true);
    setLoadError("");

    try {
      const [alertsData, statsData] = await Promise.all([getAlerts(), getAlertStats()]);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
      setStats(statsData || null);
      setLastRefreshed(new Date());
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.response?.data?.error || "Unable to load alerts right now.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Real-time auto-refresh every 10 seconds — silent, doesn't touch loading UI.
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAll({ silent: true });
    }, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleManualRefresh = () => fetchAll({ silent: true });

  // ---- derived stats (fall back to computing from the alert list if the
  // stats endpoint omits a field, so the cards never show "undefined") ----
  const computedStats = useMemo(() => {
    const total = alerts.length;
    const open = alerts.filter((a) => a.status === "OPEN").length;
    const inProgress = alerts.filter((a) => a.status === "IN_PROGRESS").length;
    const resolved = alerts.filter((a) => a.status === "RESOLVED").length;
    const critical = alerts.filter((a) => a.severity === "CRITICAL").length;
    const high = alerts.filter((a) => a.severity === "HIGH").length;
    return { total, open, inProgress, resolved, critical, high };
  }, [alerts]);

  const statCards = [
    { key: "total", label: "Total Alerts", icon: Inbox, value: stats?.total ?? computedStats.total, accent: "cyan" },
    { key: "open", label: "Open Alerts", icon: AlertTriangle, value: stats?.open ?? computedStats.open, accent: "red" },
    { key: "in_progress", label: "In Progress", icon: Clock, value: stats?.in_progress ?? computedStats.inProgress, accent: "yellow" },
    { key: "resolved", label: "Resolved Alerts", icon: CheckCircle2, value: stats?.resolved ?? computedStats.resolved, accent: "green" },
    { key: "critical", label: "Critical Alerts", icon: ShieldAlert, value: stats?.critical ?? computedStats.critical, accent: "red" },
    { key: "high", label: "High Alerts", icon: ShieldAlert, value: stats?.high ?? computedStats.high, accent: "orange" },
  ];

  const ACCENT = {
    cyan: { text: "text-[#00E5FF]", bg: "bg-[#00E5FF]/10", border: "border-[#00E5FF]/30", glow: "rgba(0,229,255,0.4)" },
    red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", glow: "rgba(248,113,113,0.4)" },
    orange: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", glow: "rgba(251,146,60,0.4)" },
    yellow: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", glow: "rgba(250,204,21,0.4)" },
    green: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "rgba(52,211,153,0.4)" },
  };

  // ---- filtering / sorting / pagination ----
  const filteredAlerts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return alerts
      .filter((a) => {
        const matchesSearch =
          !term ||
          (a.user_name || "").toLowerCase().includes(term) ||
          (a.rule_name || "").toLowerCase().includes(term);
        const matchesSeverity = severityFilter === "ALL" || a.severity === severityFilter;
        const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
        return matchesSearch && matchesSeverity && matchesStatus;
      })
      .sort((a, b) => new Date(b.triggered_at || b.created_at || 0) - new Date(a.triggered_at || a.created_at || 0));
  }, [alerts, searchTerm, severityFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedAlerts = filteredAlerts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, severityFilter, statusFilter]);

  // ---- distribution chart data ----
  const severityDist = SEVERITIES.map((s) => ({
    key: s,
    count: alerts.filter((a) => a.severity === s).length,
  }));
  const maxSeverityCount = Math.max(1, ...severityDist.map((s) => s.count));

  const statusDist = STATUSES.map((s) => ({
    key: s,
    count: alerts.filter((a) => a.status === s).length,
  }));
  const totalForStatus = Math.max(1, statusDist.reduce((sum, s) => sum + s.count, 0));

  let cumulativeDeg = 0;
  const statusColorMap = { OPEN: "#f87171", IN_PROGRESS: "#facc15", RESOLVED: "#34d399", FALSE_POSITIVE: "#94a3b8" };
  const statusConicStops = statusDist
    .filter((s) => s.count > 0)
    .map((s) => {
      const color = statusColorMap[s.key];
      const startDeg = cumulativeDeg;
      const sweep = (s.count / totalForStatus) * 360;
      cumulativeDeg += sweep;
      return `${color} ${startDeg}deg ${cumulativeDeg}deg`;
    });
  const conicGradient = statusConicStops.length ? `conic-gradient(${statusConicStops.join(", ")})` : "conic-gradient(#1F2937 0deg 360deg)";

  return (
    <div className="min-h-screen w-full bg-[#0B1220] text-[#F9FAFB] flex font-sans antialiased">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-[#111827] border-r border-[#1F2937] z-40 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-[#1F2937]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
              <span className="absolute inset-0 rounded-xl border border-[#00E5FF]/40 animate-ping opacity-40" />
              <ShieldCheck className="w-5 h-5 text-[#00E5FF]" strokeWidth={2.25} />
            </div>
            <div>
              <p className="font-semibold tracking-wide text-sm text-white leading-tight">CommandCenter</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#00E5FF]/70 font-mono">Univ. Security Ops</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          {NAV_SECTIONS.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-500 font-mono">{group.section}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSidebarOpen(false);
                        navigate(item.path);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                          ? "bg-[#00E5FF]/[0.08] text-white border border-[#00E5FF]/20 shadow-[0_0_18px_-6px_rgba(0,229,255,0.5)]"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100 border border-transparent"
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#00E5FF]" : "text-slate-500 group-hover:text-slate-300"}`} strokeWidth={2} />
                      {item.label}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#00E5FF]/70" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 pb-6 pt-3 border-t border-[#1F2937]">
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
        <header className="sticky top-0 z-20 bg-[#111827]/85 backdrop-blur-xl border-b border-[#1F2937]">
          <div className="flex items-center gap-4 px-4 sm:px-8 py-4">
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate("/SecurityCommandCenter")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
               text-slate-300 bg-[#111827] border border-[#1F2937]
               hover:bg-white/[0.04] transition-all duration-200"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Dashboard
              </button>

              <div>
                <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                  Alerts Dashboard
                </h1>

                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {lastRefreshed
                    ? `Auto-refreshing · last updated ${lastRefreshed.toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}`
                    : "Loading…"}
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] flex items-center justify-center font-semibold text-xs">
                KB
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 space-y-6">
          {loadError && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-300">{loadError}</p>
              </div>
              <button onClick={() => fetchAll()} className="text-sm font-semibold text-red-300 hover:text-red-200">
                Retry
              </button>
            </div>
          )}

          {/* ================= STAT CARDS ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
              : statCards.map((card) => {
                const Icon = card.icon;
                const accent = ACCENT[card.accent];
                return (
                  <div
                    key={card.key}
                    className={`relative rounded-2xl border ${accent.border} bg-[#111827] p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 36px -12px ${accent.glow}`)}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0px 0 transparent")}
                  >
                    <div className={`w-10 h-10 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center mb-4`}>
                      <Icon className={`w-4.5 h-4.5 ${accent.text}`} strokeWidth={2} />
                    </div>
                    <p className="text-xs font-medium text-slate-400 tracking-wide">{card.label}</p>
                    <p className={`text-2xl font-bold mt-1 font-mono ${accent.text}`}>{card.value}</p>
                  </div>
                );
              })}
          </section>

          {/* ================= DISTRIBUTION CHARTS ================= */}
          {!isLoading && !loadError && alerts.length > 0 && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6">
                <h3 className="text-sm font-semibold text-white mb-5">Severity Distribution</h3>
                <div className="space-y-4">
                  {severityDist.map((s) => (
                    <div key={s.key}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className={SEVERITY_STYLES[s.key].split(" ")[0]}>{s.key}</span>
                        <span className="text-slate-500 font-mono">{s.count}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${SEVERITY_DOT[s.key]}`}
                          style={{ width: `${(s.count / maxSeverityCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6">
                <h3 className="text-sm font-semibold text-white mb-5">Status Distribution</h3>
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32 rounded-full shrink-0" style={{ background: conicGradient }}>
                    <div className="absolute inset-3 rounded-full bg-[#111827] flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-white font-mono">{alerts.length}</span>
                      <span className="text-[9px] text-slate-500">total</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2.5">
                    {statusDist.map((s) => (
                      <div key={s.key} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColorMap[s.key] }} />
                          <span className="text-slate-400">{STATUS_LABEL[s.key]}</span>
                        </div>
                        <span className="font-mono text-slate-300">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= TOOLBAR ================= */}
          <section className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by user name or rule name…"
                className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F9FAFB] placeholder:text-slate-500 outline-none focus:border-[#00E5FF]/50 focus:ring-2 focus:ring-[#00E5FF]/20 transition-all duration-200"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-2.5 text-sm text-[#F9FAFB] outline-none focus:border-[#00E5FF]/50 cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-2.5 text-sm text-[#F9FAFB] outline-none focus:border-[#00E5FF]/50 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono px-2">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sorted by latest
            </div>
          </section>

          {/* ================= TABLE ================= */}
          {isLoading ? (
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-10 flex flex-col items-center gap-3">
              <Loader2 className="w-7 h-7 text-[#00E5FF] animate-spin" />
              <p className="text-xs text-slate-500 font-mono">Loading alerts…</p>
            </div>
          ) : !loadError && alerts.length === 0 ? (
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827] flex flex-col items-center justify-center text-center py-16">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-[#1F2937] flex items-center justify-center mb-4">
                <Inbox className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">No alerts recorded yet</p>
              <p className="text-xs text-slate-500 max-w-xs">Security alerts will appear here the moment they're triggered.</p>
            </div>
          ) : !loadError ? (
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-[#1F2937] font-mono">
                      <th className="px-5 py-3 font-medium">Alert ID</th>
                      <th className="px-5 py-3 font-medium">Rule ID</th>
                      <th className="px-5 py-3 font-medium">Rule Name</th>
                      <th className="px-5 py-3 font-medium">Severity</th>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 font-medium">User</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Triggered</th>
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedAlerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150">
                        <td className="px-5 py-4 font-mono text-xs text-slate-300">{alert.id}</td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-400">{alert.rule_id}</td>
                        <td className="px-5 py-4 text-slate-200">{alert.rule_name}</td>
                        <td className="px-5 py-4"><SeverityBadge severity={alert.severity} /></td>
                        <td className="px-5 py-4 text-slate-400">{alert.category || "—"}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-bold flex items-center justify-center shrink-0">
                              {getInitials(alert.user_name)}
                            </span>
                            <div className="min-w-0">
                              <p className="text-slate-200 truncate">{alert.user_name || "Unknown"}</p>
                              <p className="text-[11px] text-slate-500 truncate">{alert.user_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={alert.status} /></td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-400">{formatTimestamp(alert.triggered_at)}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => navigate(`/alerts/${alert.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 hover:bg-[#00E5FF]/20 transition-all duration-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAlerts.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-14">
                  <Ban className="w-6 h-6 text-slate-500 mb-3" />
                  <p className="text-sm text-slate-400">No alerts match your current search or filters.</p>
                </div>
              )}

              {filteredAlerts.length > 0 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-[#1F2937]">
                  <p className="text-xs text-slate-500 font-mono">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredAlerts.length)} of {filteredAlerts.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 border border-[#1F2937] hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </button>
                    <span className="text-xs text-slate-500 font-mono px-2">
                      Page {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 border border-[#1F2937] hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
