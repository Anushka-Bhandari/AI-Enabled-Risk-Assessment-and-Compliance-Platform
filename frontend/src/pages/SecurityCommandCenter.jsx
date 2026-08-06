import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import socket from "../services/socket";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Activity,
  ShieldAlert,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Wifi,
  ChevronRight,
  CircleDot,
  FileCheck2,
  Gauge,
  FileText,
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
/*  Design tokens                                                      */
/*  bg-deep   #020817   page background                                */
/*  bg-panel  #0B1120   sidebar / header                                */
/*  bg-card   #111827   card surfaces                                   */
/*  accent    cyan  #22D3EE   primary glow / signature                  */
/*  online    emerald #10B981                                           */
/*  severity  critical #EF4444 · high #F97316 · medium #EAB308 · low #3B82F6 */
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
      {
        key: "new-assessment", label: "New Assessment", path: "/assessments/new", icon: ClipboardCheck
      },
      { key: "assessment-history", label: "Assessment History", icon: History, path: "/assessment-history" },
    ],
  },

  {
    section: "SETTINGS",
    items: [{ key: "configuration", label: "Configuration", icon: Settings, path: "/configuration" }],
  },
];

const SEVERITY_STYLES = {
  Critical: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", dot: "bg-red-500" },
  High: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", dot: "bg-orange-500" },
  Medium: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", dot: "bg-yellow-500" },
  Low: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", dot: "bg-blue-500" },
};

const RISK_STYLES = {
  High: "text-red-400 bg-red-500/10 border-red-500/30",
  Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  Low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

const EVENT_STATUS_STYLES = {
  info: { dot: "bg-emerald-400", text: "text-emerald-300", glow: "shadow-[0_0_8px_0_rgba(52,211,153,0.6)]" },
  warning: { dot: "bg-yellow-400", text: "text-yellow-300", glow: "shadow-[0_0_8px_0_rgba(250,204,21,0.6)]" },
  critical: { dot: "bg-red-400", text: "text-red-300", glow: "shadow-[0_0_8px_0_rgba(248,113,113,0.6)]" },
};

// Meta only — value/trend are computed in-component from live API data,
// with these numbers used purely as the pre-load / fallback state so the
// layout never looks broken while data is loading or if a field is absent.
const KPI_META = [
  {
    key: "activityLogsToday",
    label: "Activity Logs Today",
    icon: ScrollText,
    glow: "rgba(34,211,238,0.45)",
    ring: "border-cyan-400/20",
    fallbackValue: "12,456",
    fallbackTrend: "+18% from yesterday",
    fallbackTrendUp: true,
  },
  {
    key: "openAlerts",
    label: "Open Alerts",
    icon: Bell,
    glow: "rgba(250,204,21,0.4)",
    ring: "border-yellow-400/20",
    fallbackValue: "18",
    fallbackTrend: "4 require immediate action",
    fallbackTrendUp: false,
  },
  {
    key: "criticalIncidents",
    label: "Critical Incidents",
    icon: ShieldAlert,
    glow: "rgba(248,113,113,0.45)",
    ring: "border-red-400/20",
    fallbackValue: "2",
    fallbackTrend: "High priority",
    fallbackTrendUp: false,
  },
  {
    key: "activeFaculty",
    label: "Active Faculty",
    icon: UserCheck,
    glow: "rgba(16,185,129,0.4)",
    ring: "border-emerald-400/20",
    fallbackValue: "145",
    fallbackTrend: "Currently online",
    fallbackTrendUp: true,
  },
];

// The chart used to read from a hardcoded 12-bucket array. Now the buckets
// are generated empty, filled once from a real aggregation endpoint on
// load, and bumped live as socket events arrive — see fetchEventActivity
// and the categorizeEventForChart() call inside the socket handler below.

// Same 2-hour bucketing the backend aggregation endpoint uses, so a
// locally-computed live increment lands in the same bucket the backend
// would put it in on the next full refresh.
function getBucketLabelForDate(date) {
  const hour = date.getHours();
  const flooredHour = hour - (hour % 2);
  return `${String(flooredHour).padStart(2, "0")}:00`;
}

// Maps a raw socket event onto one of the four chart series. Returns null
// for event types that don't belong on this particular chart (they still
// show up in the Live Event Stream panel, just don't move this graph).
function categorizeEventForChart(event) {
  const type = (event.event_type || "").toUpperCase();
  const status = (event.status || "").toUpperCase();

  if (status === "CRITICAL") return "suspicious";
  if (["SUSPICIOUS_ACTIVITY", "PRIVILEGE_ESCALATION", "ALERT"].includes(type)) return "suspicious";

  if (type === "LOGIN") return status === "INFO" ? "login" : "failedLogin";
  if (type === "FAILED_LOGIN") return "failedLogin";

  if (type.includes("FILE")) return "fileAccess";

  return null;
}

const EVENT_POOL = [
  { type: "Faculty Login", status: "info" },
  { type: "Assignment Uploaded", status: "info" },
  { type: "Failed Login Attempt", status: "warning" },
  { type: "Alert Generated", status: "critical" },
  { type: "Investigation Started", status: "warning" },
  { type: "File Downloaded", status: "info" },
  { type: "Password Reset Requested", status: "warning" },
  { type: "VPN Session Established", status: "info" },
  { type: "Suspicious IP Detected", status: "critical" },
  { type: "Compliance Report Generated", status: "info" },
  { type: "Multi-Factor Challenge Passed", status: "info" },
  { type: "Privilege Escalation Attempt", status: "critical" },
];

const FACULTY_POOL = [
  "Dr. A. Sharma",
  "Prof. R. Mehta",
  "Dr. L. Chen",
  "Prof. K. Owusu",
  "Dr. S. Fernandez",
  "Prof. N. Patel",
];

const DEPARTMENTS = ["Computer Science", "Finance", "Registrar's Office", "Engineering", "Admissions", "Library Systems"];

const FACULTY_MONITORING = [
  { name: "Dr. A. Sharma", department: "Computer Science", activities: 214, risk: "Low" },
  { name: "Prof. R. Mehta", department: "Registrar's Office", activities: 187, risk: "Medium" },
  { name: "Dr. L. Chen", department: "Engineering", activities: 163, risk: "Low" },
  { name: "Prof. K. Owusu", department: "Finance", activities: 141, risk: "High" },
  { name: "Dr. S. Fernandez", department: "Admissions", activities: 129, risk: "Low" },
];

const RISK_OVERVIEW_META = [
  { key: "assessmentsCompleted", label: "Assessments Completed", icon: FileCheck2, fallbackValue: "86" },
  { key: "complianceScore", label: "Compliance Score", icon: Gauge, fallbackValue: "91%" },
  { key: "highRiskFindings", label: "High Risk Findings", icon: ShieldAlert, fallbackValue: "6" },
];

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const ACTIVITY_BUCKET_LABELS = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

function buildEmptyActivityBuckets() {
  return ACTIVITY_BUCKET_LABELS.map((hour) => ({
    time: hour,
    login: 0,
    fileAccess: 0,
    failedLogin: 0,
    suspicious: 0,
  }));
}

export default function SecurityCommandCenter() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentAlerts, setRecentAlerts] = useState([]);


  const [events, setEvents] = useState([]);

  // Real chart data — starts at zero, filled from the aggregation
  // endpoint on load, then incremented live as socket events arrive.
  const [eventActivityData, setEventActivityData] = useState(buildEmptyActivityBuckets);

  const updateGraph = useCallback((event) => {

    setEventActivityData(prev => {

      const label =
        `${String(new Date(event.timestamp).getHours()).padStart(2, "0")}:00`;

      return prev.map(item => {

        if (item.time !== label)
          return item;

        const updated = { ...item };

        const type = event.event_type?.toUpperCase();
        const status = event.status?.toUpperCase();

        if (type === "LOGIN")
          updated.login += 1;

        if (type?.includes("FILE"))
          updated.fileAccess += 1;

        if (status === "CRITICAL")
          updated.suspicious += 1;

        if (
          status === "FAILED" ||
          status === "FAILURE"
        )
          updated.failedLogin += 1;

        return updated;
      });

    });

  }, []);

  const streamRef = useRef(null);

  // Same auth pattern as the old Dashboard.jsx — bearer token from
  // localStorage, attached to every authenticated request.
  const authHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  // Pulls the same /dashboard and /dashboard/analytics endpoints the old
  // dashboard used. Everything with a sane mapping (critical incidents,
  // compliance score, assessments completed, reports generated, high
  // risk findings) is wired to real data below. Fields with no backend
  // equivalent yet (open alerts, active faculty, alerts table, faculty
  // monitoring) keep their fallback/mock values — swap those endpoint
  // URLs in once they exist.
  const fetchDashboard = useCallback(async () => {
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
        "Unable to load security dashboard data right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders, navigate]);

  const fetchEventActivity = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/dashboard/event-activity`,
        {
          headers: authHeaders(),
        }
      );

      if (Array.isArray(res.data)) {
        setEventActivityData(res.data);
      }

    } catch (err) {
      console.warn(
        "Unable to load event activity history:",
        err?.message
      );
    }
  }, [authHeaders]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboard();
    fetchEventActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }


    socket.auth = {
        token
    };


    socket.connect();


    socket.on("connect", () => {
        console.log(
            "Socket connected:",
            socket.id
        );
    });


    socket.on("disconnect", () => {
        console.log(
            "Socket disconnected"
        );
    });



    return () => {

        socket.disconnect();

        socket.off("connect");
        socket.off("disconnect");

    };


}, []);

  // Historical fill for the Security Event Activity chart. Kept separate
  // from fetchDashboard so a missing/erroring endpoint here doesn't take
  // down the rest of the dashboard — the chart just stays at zero (or
  // live-only) until this succeeds.

  // Simulated live event feed — new entries prepend, list is capped.
  // Real-time security event stream
  useEffect(() => {

    const handleNewEvent = (event) => {
      console.log(
        event.event_name,
        event.event_type,
        event.status
      );

      const criticalEvents = [
        "FAILED_LOGIN",
        "PRIVILEGE_ESCALATION",
        "MALWARE_DETECTED",
        "UNKNOWN_DEVICE",
        "UNKNOWN_IP",
      ];

      const warningEvents = [
        "DATABASE_DOWNLOAD",
        "FILE_DOWNLOAD",
        "USB_CONNECTED",
        "VPN_LOGIN",
      ];

      const eventType = (event.event_type || "").toUpperCase();

      let uiStatus = "info";

      if (criticalEvents.includes(eventType)) {
        uiStatus = "critical";
      } else if (warningEvents.includes(eventType)) {
        uiStatus = "warning";
      }

      const newEvent = {
        id: event.event_id,
        time: new Date(event.timestamp),
        user: event.user_name,
        type: event.event_name,
        status: uiStatus,
      };

      updateGraph(event);


      // Update Live Stream
      setEvents(prev => {

        const exists = prev.some(
          e => e.id === newEvent.id
        );

        if (exists)
          return prev;


        return [
          newEvent,
          ...prev
        ].slice(0, 30);

      });



      // Update Graph
      updateGraph(event);
    };


    socket.on(
      "new_event",
      handleNewEvent
    );


    return () => {
      socket.off(
        "new_event",
        handleNewEvent
      );
    };


  }, []);
  // Last-sync heartbeat, purely cosmetic — reinforces "live system" feel.
  useEffect(() => {
    const interval = setInterval(() => setLastSync(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const formattedSync = useMemo(
    () =>
      lastSync.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [lastSync]
  );

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/alerts/recent`, {
        headers: authHeaders(),
      })
      .then((res) => {
        console.log("ALERT DATA:", res.data);
        setRecentAlerts(res.data);
      })
      .catch(console.error);
  }, []);

  // Same derivation as the old Dashboard.jsx: risk breakdown, total
  // assessments, and compliance score all come straight off the
  // analytics endpoint.
  const riskCounts = useMemo(
    () => analyticsData?.risk_breakdown ?? { High: 0, Medium: 0, Low: 0 },
    [analyticsData]
  );
  const totalAssessments =
    analyticsData?.total_assessments ?? dashboardData?.total_assessments ?? 0;
  const complianceScore = analyticsData?.compliance_score ?? null;
  const reportsGenerated = Math.max(totalAssessments - riskCounts.High, 0);

  const kpiCards = useMemo(
    () =>
      KPI_META.map((meta) => {
        if (meta.key === "criticalIncidents" && analyticsData) {
          return {
            ...meta,
            value: String(riskCounts.High ?? 0),
            trend: riskCounts.High > 0 ? "High priority" : "All clear",
            trendUp: riskCounts.High === 0,
          };
        }
        return {
          ...meta,
          value: meta.fallbackValue,
          trend: meta.fallbackTrend,
          trendUp: meta.fallbackTrendUp,
        };
      }),
    [analyticsData, riskCounts]
  );

  const riskOverview = useMemo(
    () =>
      RISK_OVERVIEW_META.map((meta) => {
        if (meta.key === "assessmentsCompleted" && analyticsData) {
          return { ...meta, value: String(totalAssessments) };
        }
        if (meta.key === "complianceScore" && complianceScore !== null) {
          return { ...meta, value: `${complianceScore}%` };
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
        className={`fixed lg:sticky top-0 h-screen w-72 bg-[#0B1120] border-r border-white/[0.06] z-40 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* faint grid texture, consistent with the command-center motif */}
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
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

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                University Security &amp; Compliance Command Center
              </h1>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Last Sync {formattedSync}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold tracking-wide text-emerald-300 font-mono">
                  SYSTEM ONLINE
                </span>
              </div>

              <button className="relative w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] transition-all duration-200">
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0B1120]" />
              </button>

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
                onClick={fetchDashboard}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-300 hover:text-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* ================= KPI ROW ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 animate-pulse"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/[0.06] mb-5" />
                  <div className="h-3 w-24 bg-white/[0.06] rounded mb-3" />
                  <div className="h-7 w-16 bg-white/[0.06] rounded" />
                </div>
              ))
              : kpiCards.map((card, i) => {
                const Icon = card.icon;
                const TrendIcon = card.trendUp ? TrendingUp : TrendingDown;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className={`relative rounded-2xl border ${card.ring} bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden group transition-all duration-300 hover:-translate-y-1`}
                    style={{ boxShadow: `0 0 0px 0 transparent` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 40px -12px ${card.glow}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0px 0 transparent`;
                    }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center border"
                        style={{
                          background: `${card.glow.replace("0.45", "0.12").replace("0.4", "0.12")}`,
                          borderColor: card.glow.replace(/[\d.]+\)$/, "0.3)"),
                        }}
                      >
                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <TrendIcon
                        className={`w-4 h-4 ${card.trendUp ? "text-emerald-400" : "text-slate-500"}`}
                      />
                    </div>
                    <p className="text-xs font-medium text-slate-400 tracking-wide">{card.label}</p>
                    <p className="text-3xl font-bold text-white mt-1.5 font-mono">{card.value}</p>
                    <p className="text-xs text-slate-500 mt-2">{card.trend}</p>
                  </motion.div>
                );
              })}
          </section>

          {/* ================= CHART + LIVE STREAM ================= */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-white text-sm">Security Event Activity</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Rolling 24-hour event volume</p>
                </div>
                <Activity className="w-4.5 h-4.5 text-cyan-400/70" />
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={eventActivityData}>
                  <defs>
                    <linearGradient id="loginGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fileGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#818CF8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FB923C" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#FB923C" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="suspiciousGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F87171" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#F87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0B1120",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      fontSize: 12,
                      color: "#e2e8f0",
                    }}
                  />
                  <Area type="monotone" dataKey="login" name="Login Events" stroke="#22D3EE" strokeWidth={2} fill="url(#loginGrad)" />
                  <Area type="monotone" dataKey="fileAccess" name="File Access Events" stroke="#818CF8" strokeWidth={2} fill="url(#fileGrad)" />
                  <Area type="monotone" dataKey="failedLogin" name="Failed Login Attempts" stroke="#FB923C" strokeWidth={2} fill="url(#failedGrad)" />
                  <Area type="monotone" dataKey="suspicious" name="Suspicious Activities" stroke="#F87171" strokeWidth={2} fill="url(#suspiciousGrad)" />
                </AreaChart>
              </ResponsiveContainer>

              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/[0.06]">
                {[
                  { label: "Login Events", color: "#22D3EE" },
                  { label: "File Access Events", color: "#818CF8" },
                  { label: "Failed Login Attempts", color: "#FB923C" },
                  { label: "Suspicious Activities", color: "#F87171" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-[11px] text-slate-400">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE EVENT STREAM — terminal-inspired signature panel */}
            <div
              onClick={() => navigate("/event-stream")}
              className="
  rounded-2xl 
  border border-white/[0.06] 
  bg-[#0B1120] 
  overflow-hidden 
  flex flex-col
  cursor-pointer
  hover:border-cyan-400/30
  transition-all
  "
            >
              <div className="relative px-5 py-4 border-b border-white/[0.06] overflow-hidden">
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" />

                    <h3 className="
  text-xs 
  font-semibold 
  tracking-[0.15em] 
  text-cyan-300 
  font-mono
  ">
                      LIVE EVENT STREAM
                    </h3>
                  </div>


                  <button
                    onClick={() => navigate("/event-stream")}
                    className="
  text-xs
  text-cyan-400
  hover:text-cyan-300
  font-mono
  "
                  >
                    View Full Stream →
                  </button>


                </div>
                {/* scanline sweep, ties back to the sidebar/header grid motif */}
                <motion.div
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div
                ref={streamRef}
                className="flex-1 px-5 py-4 space-y-2.5 overflow-y-auto font-mono text-xs max-h-[340px]"
              >
                <AnimatePresence initial={false}>
                  {events.map((evt) => {

                    const style =
                      EVENT_STATUS_STYLES[evt.status] ||
                      EVENT_STATUS_STYLES.info;

                    return (
                      <motion.div
                        key={evt.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-2.5"
                      >
                        <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${style.dot} ${style.glow}`} />
                        <div className="min-w-0">
                          <span className="text-slate-500">
                            {evt.time.toLocaleTimeString("en-US", { hour12: false })}
                          </span>{" "}
                          <span className={style.text}>{evt.type}</span>
                          <span className="text-slate-600"> · {evt.user}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* ================= RECENT ALERTS TABLE ================= */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div>
                <h3 className="font-semibold text-white text-sm">Recent Alerts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Latest triggered security alerts</p>
              </div>
              <button
                onClick={() => navigate("/alerts")}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-white/[0.06] font-mono">
                    <th className="px-6 py-3 font-medium">Alert ID</th>
                    <th className="px-6 py-3 font-medium">Severity</th>
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map((alert) => {

                    const normalizedSeverity =
                      alert.severity?.charAt(0).toUpperCase() +
                      alert.severity?.slice(1).toLowerCase();

                    const style =
                      SEVERITY_STYLES[normalizedSeverity] || SEVERITY_STYLES.Low;
                    return (
                      <tr
                        key={alert.id}
                        className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150"
                      >
                        <td className="px-6 py-4 font-medium text-slate-200 font-mono">{alert.id}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.text} ${style.bg} ${style.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            {alert.severity}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-400">{alert.user_name}</td>
                        <td className="px-6 py-4 text-slate-400">{alert.title}</td>

                        <td className="px-6 py-4 text-slate-400">{alert.status}</td>


                        <td className="px-6 py-4 text-slate-500 font-mono">
                          {new Date(alert.triggered_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ================= FACULTY MONITORING + RISK OVERVIEW ================= */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Faculty monitoring — primary focus, gets 2/3 width */}
            <div className="xl:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-white text-sm">Faculty Monitoring Overview</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Most active faculty today</p>
                </div>
                <Wifi className="w-4 h-4 text-cyan-400/60" />
              </div>
              <div className="space-y-2">
                {FACULTY_MONITORING.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-400/20 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-200 text-xs font-semibold shrink-0">
                        {getInitials(f.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{f.name}</p>
                        <p className="text-xs text-slate-500">{f.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-200 font-mono">{f.activities}</p>
                        <p className="text-[10px] text-slate-500">activities today</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${RISK_STYLES[f.risk]}`}
                      >
                        {f.risk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk assessment overview — intentionally smaller, secondary focus */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-white text-sm">Risk Assessment Overview</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Compliance snapshot</p>
                </div>
                <CircleDot className="w-4 h-4 text-slate-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {riskOverview.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5"
                    >
                      <Icon className="w-4 h-4 text-cyan-400/70 mb-2" />
                      <p className="text-lg font-bold text-white font-mono leading-none">{stat.value}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-tight">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}