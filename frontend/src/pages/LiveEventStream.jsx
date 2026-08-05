import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  Bell,
  Menu,
  X,
  ChevronRight,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

// Adjust this relative path to wherever src/socket.js actually lives
// relative to this file (e.g. "../../socket" if this page sits in
// src/pages/). The socket instance is assumed to already exist and be
// connected/managed elsewhere in the app.
import socket from "../services/socket";

import EventFilters from "./EventFilters";
import EventStats from "./EventStats";
import LiveTimeline from "./LiveTimeline";
import { normalizeSeverity, MAX_EVENTS_IN_MEMORY } from "../services/eventStreamUtils";

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

export default function LiveEventStream() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // "connecting" | "connected" | "disconnected"
  const [connectionStatus, setConnectionStatus] = useState(
    socket.connected ? "connected" : "connecting"
  );

  // Visible, capped, de-duplicated event list — newest first.
  const [events, setEvents] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  // Running session totals — independent of the 200-event visible cap,
  // and independent of pause (pausing only freezes what's rendered).
  const [totalToday, setTotalToday] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [infoCount, setInfoCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  // Buffer for events received while paused; flushed into `events` on resume.
  const pendingBufferRef = useRef([]);
  // Timestamps (ms) of received events, used to compute events/minute.
  const receiptTimestampsRef = useRef([]);
  const [eventsPerMinute, setEventsPerMinute] = useState(0);

  /* ---------------------------------------------------------------- */
  /*  Clock + events/min ticker                                        */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      const cutoff = Date.now() - 60_000;
      receiptTimestampsRef.current = receiptTimestampsRef.current.filter((t) => t > cutoff);
      setEventsPerMinute(receiptTimestampsRef.current.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Socket.IO wiring                                                  */
  /* ---------------------------------------------------------------- */
  const isDuplicate = useCallback((eventId, list) => list.some((e) => e.event_id === eventId), []);

  const recordStats = useCallback((evt) => {
    setTotalToday((n) => n + 1);
    const severity = normalizeSeverity(evt.status);
    if (severity === "CRITICAL") setCriticalCount((n) => n + 1);
    else if (severity === "WARNING") setWarningCount((n) => n + 1);
    else setInfoCount((n) => n + 1);
    receiptTimestampsRef.current.push(Date.now());
  }, []);

  const handleNewEvent = useCallback(
    (payload) => {
      if (!payload || !payload.event_id) return;

      setEvents((prevEvents) => {
        if (isDuplicate(payload.event_id, prevEvents)) return prevEvents;
        if (isDuplicate(payload.event_id, pendingBufferRef.current)) return prevEvents;

        // Stats always update, live, regardless of pause state — pausing
        // only affects what's rendered, not what's tracked.
        recordStats(payload);

        if (isPaused) {
          pendingBufferRef.current = [payload, ...pendingBufferRef.current];
          setPendingCount(pendingBufferRef.current.length);
          return prevEvents;
        }

        const next = [payload, ...prevEvents];
        return next.length > MAX_EVENTS_IN_MEMORY ? next.slice(0, MAX_EVENTS_IN_MEMORY) : next;
      });
    },
    [isPaused, isDuplicate, recordStats]
  );

  useEffect(() => {
    const handleConnect = () => setConnectionStatus("connected");
    const handleDisconnect = () => setConnectionStatus("disconnected");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("new_event", handleNewEvent);

    // In case the socket was already connected before this component mounted.
    if (socket.connected) setConnectionStatus("connected");

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("new_event", handleNewEvent);
    };
  }, [handleNewEvent]);

  /* ---------------------------------------------------------------- */
  /*  Stream controls                                                   */
  /* ---------------------------------------------------------------- */
  const handleTogglePause = useCallback(() => {
    setIsPaused((prevPaused) => {
      const resuming = prevPaused;
      if (resuming) {
        setEvents((prevEvents) => {
          const merged = [...pendingBufferRef.current, ...prevEvents];
          pendingBufferRef.current = [];
          setPendingCount(0);
          return merged.slice(0, MAX_EVENTS_IN_MEMORY);
        });
      }
      return !prevPaused;
    });
  }, []);

  const handleClear = useCallback(() => {
    setEvents([]);
    pendingBufferRef.current = [];
    setPendingCount(0);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Derived data for filters + filtered view + active users            */
  /* ---------------------------------------------------------------- */
  const availableTypes = useMemo(
    () => [...new Set(events.map((e) => e.event_type).filter(Boolean))].sort(),
    [events]
  );
  const availableDepartments = useMemo(
    () => [...new Set(events.map((e) => e.department).filter(Boolean))].sort(),
    [events]
  );
  const activeUsers = useMemo(
    () => new Set(events.map((e) => e.user_name).filter(Boolean)).size,
    [events]
  );

  const filteredEvents = useMemo(() => {
    let rows = events;

    if (severityFilter !== "ALL") {
      rows = rows.filter((e) => normalizeSeverity(e.status) === severityFilter);
    }
    if (typeFilter !== "ALL") {
      rows = rows.filter((e) => e.event_type === typeFilter);
    }
    if (departmentFilter !== "ALL") {
      rows = rows.filter((e) => e.department === departmentFilter);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter((e) =>
        [e.user_name, e.event_name, e.ip_address, e.location, e.device]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q))
      );
    }

    return rows;
  }, [events, severityFilter, typeFilter, departmentFilter, searchQuery]);

  const hasActiveFilters =
    severityFilter !== "ALL" || typeFilter !== "ALL" || departmentFilter !== "ALL" || searchQuery.trim() !== "";

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                          ? "bg-cyan-400/[0.08] text-white border border-cyan-400/20 shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100 border border-transparent"
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300"}`} strokeWidth={2} />
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
        <header className="sticky top-0 z-20 bg-[#0B1120]/85 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center gap-4 px-4 sm:px-8 py-4">
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            <div className="min-w-0 flex items-center gap-3">
              <button
                onClick={() => navigate("/SecurityCommandCenter")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-white/[0.03] border border-white/[0.08] hover:bg-cyan-400/[0.08] hover:text-cyan-300 hover:border-cyan-400/30 transition-all duration-200"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                Dashboard
              </button>

              <div>
                <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                  Live Security Event Stream
                </h1>

                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {now.toLocaleTimeString("en-US", { hour12: false })} ·{" "}
                  {now.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-mono text-slate-300">{eventsPerMinute}/min</span>
              </div>

              <ConnectionBadge status={connectionStatus} />

              <button className="relative w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] transition-all duration-200">
                <Bell className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 items-start">
            {/* LEFT — 70% timeline */}
            <div className="space-y-5 min-w-0">
              <EventFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                severityFilter={severityFilter}
                onSeverityChange={setSeverityFilter}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                departmentFilter={departmentFilter}
                onDepartmentChange={setDepartmentFilter}
                availableTypes={availableTypes}
                availableDepartments={availableDepartments}
                isPaused={isPaused}
                onTogglePause={handleTogglePause}
                onClear={handleClear}
                autoScroll={autoScroll}
                onToggleAutoScroll={setAutoScroll}
                pendingCount={pendingCount}
              />

              <LiveTimeline
                events={filteredEvents}
                isLoading={connectionStatus === "connecting" && events.length === 0}
                connectionStatus={connectionStatus}
                isPaused={isPaused}
                autoScroll={autoScroll}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* RIGHT — 30% analytics */}
            <div className="xl:sticky xl:top-24">
              <EventStats
                stats={{
                  totalToday,
                  critical: criticalCount,
                  warning: warningCount,
                  info: infoCount,
                  activeUsers,
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ConnectionBadge({ status }) {
  if (status === "connected") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <Wifi className="w-3.5 h-3.5 text-emerald-300" />
        <span className="text-[11px] font-semibold tracking-wide text-emerald-300 font-mono hidden sm:inline">
          CONNECTED
        </span>
      </div>
    );
  }

  if (status === "connecting") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[11px] font-semibold tracking-wide text-amber-300 font-mono hidden sm:inline">
          CONNECTING
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-400/10 border border-red-400/30">
      <WifiOff className="w-3.5 h-3.5 text-red-300" />
      <span className="text-[11px] font-semibold tracking-wide text-red-300 font-mono hidden sm:inline">
        DISCONNECTED
      </span>
    </div>
  );
}