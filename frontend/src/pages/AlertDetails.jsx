import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
  CheckCircle2,
  Loader2,
  FileText,
  User,
  Cpu,
  Globe2,
  Clock3,
  Save,
} from "lucide-react";
import { getAlertById, updateAlertStatus } from "../services/alertService";

/* ------------------------------------------------------------------ */
/*  Theme — matches AlertsDashboard.jsx                                 */
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

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "FALSE_POSITIVE"];

function formatTimestamp(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function SeverityBadge({ severity }) {
  if (!severity) return <span className="text-[11px] text-slate-500">Unknown</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${SEVERITY_STYLES[severity] || "text-slate-400 bg-slate-500/10 border-slate-500/30"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[severity] || "bg-slate-400"}`} />
      {severity}
    </span>
  );
}

function StatusBadge({ status }) {
  if (!status) return <span className="text-xs text-slate-500">Unknown</span>;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[status] || "text-slate-400 bg-slate-500/10 border-slate-500/30"}`}>
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

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-sm text-slate-200 font-medium break-words">{value ?? "—"}</span>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-[#00E5FF]" />
        </div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function AlertDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

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

  const fetchAlert = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await getAlertById(id);
      setAlert(data);
      setSelectedStatus(data?.status || "");
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || "Unable to load this alert.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAlert();
  }, [fetchAlert]);

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === alert?.status) return;
    setIsUpdating(true);
    try {
      await updateAlertStatus(id, selectedStatus);
      showToast(`Status updated to ${STATUS_LABEL[selectedStatus] || selectedStatus}.`, "success");
      // Refresh alert details from the server so every field (including
      // resolved_at) reflects the update. Dashboard stats refresh
      // naturally the next time that page is visited/auto-refreshes.
      await fetchAlert();
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || "Unable to update the alert status.";
      showToast(message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const metadata = alert?.detection_metadata || alert?.event_metadata || null;
  const sourceEvent = alert?.source_event_id || null;

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

            <div className="min-w-0">
              <nav className="flex items-center gap-1.5 text-[11px] font-mono mb-1">
                <button onClick={() => navigate("/alerts")} className="text-slate-500 hover:text-[#00E5FF] transition-colors">
                  Alerts
                </button>
                <span className="text-slate-600">/</span>
                <span className="text-[#00E5FF]/80">Alert #{id}</span>
              </nav>
              <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">Incident Investigation</h1>
            </div>

            <button
              onClick={() => navigate("/alerts")}
              className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 border border-[#1F2937] hover:bg-white/[0.04] transition-all duration-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Alerts
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 space-y-6">
          {isLoading ? (
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-16 flex flex-col items-center gap-3">
              <Loader2 className="w-7 h-7 text-[#00E5FF] animate-spin" />
              <p className="text-xs text-slate-500 font-mono">Loading alert details…</p>
            </div>
          ) : loadError ? (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white mb-1">Unable to load alert</p>
                <p className="text-sm text-red-300">{loadError}</p>
              </div>
              <button onClick={fetchAlert} className="text-sm font-semibold text-red-300 hover:text-red-200">
                Retry
              </button>
            </div>
          ) : alert ? (
            <>
              {/* ================= HEADER STRIP ================= */}
              <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-mono mb-1">ALERT #{alert.id}</p>
                  <h2 className="text-lg font-bold text-white">{alert.rule_name || "Untitled Alert"}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={alert.severity} />
                  <StatusBadge status={alert.status} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ================= LEFT: DETAILS ================= */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Alert Information */}
                  <SectionCard icon={ShieldAlert} title="Alert Information">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                      <InfoRow label="Rule ID" value={alert.rule_id} />
                      <InfoRow label="Rule Name" value={alert.rule_name} />
                      <InfoRow label="Severity" value={<SeverityBadge severity={alert.severity} />} />
                      <InfoRow label="Category" value={alert.category} />
                      <InfoRow label="Status" value={<StatusBadge status={alert.status} />} />
                    </div>
                  </SectionCard>

                  {/* User Information */}
                  <SectionCard icon={User} title="User Information">
                    <div className="grid grid-cols-2 gap-5">
                      <InfoRow label="Name" value={alert.user_name} />
                      <InfoRow label="Email" value={alert.user_email} />
                    </div>
                  </SectionCard>

                  {/* Alert Description */}
                  <SectionCard icon={FileText} title="Alert Description">
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {alert.description || "No description was provided for this alert."}
                    </p>
                  </SectionCard>

                  {/* Detection Metadata */}
                  <SectionCard icon={Cpu} title="Detection Metadata">
                    <pre className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-4 text-xs text-emerald-300 font-mono overflow-x-auto">
                      {metadata ? JSON.stringify(metadata, null, 2) : "No detection metadata available."}
                    </pre>
                  </SectionCard>

                  {/* Source Event Information */}
                  <SectionCard icon={Globe2} title="Source Event Information">
                    <InfoRow
                      label="Source Event ID"
                      value={sourceEvent || "Not Available"}
                    />
                  </SectionCard>

                  {/* Timeline */}
                  <SectionCard icon={Clock3} title="Timeline">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">Triggered At</p>
                          <p className="text-sm text-slate-200 font-mono">{formatTimestamp(alert.triggered_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#00E5FF] mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">Created At</p>
                          <p className="text-sm text-slate-200 font-mono">{formatTimestamp(alert.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">Resolved At</p>
                          <p className="text-sm text-slate-200 font-mono">{formatTimestamp(alert.resolved_at)}</p>
                        </div>
                      </div>
                    </div>
                  </SectionCard>
                </div>

                {/* ================= RIGHT: INCIDENT RESPONSE PANEL ================= */}
                <div className="lg:col-span-1">
                  <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#111827] p-6 sticky top-24">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
                        <ShieldCheck className="w-4.5 h-4.5 text-[#00E5FF]" />
                      </div>
                      <h3 className="text-sm font-semibold text-white">Incident Response</h3>
                    </div>

                    <p className="text-xs text-slate-500 mb-2">Current Status</p>
                    <div className="mb-5">
                      <StatusBadge status={alert.status} />
                    </div>

                    <p className="text-xs text-slate-500 mb-2">Update Status</p>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full bg-[#0B1220] border border-[#1F2937] rounded-xl px-4 py-2.5 text-sm text-[#F9FAFB] outline-none focus:border-[#00E5FF]/50 cursor-pointer mb-4"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleUpdateStatus}
                      disabled={isUpdating || selectedStatus === alert.status}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-[#0B1220] bg-[#00E5FF] shadow-[0_0_24px_-6px_rgba(0,229,255,0.7)] transition-all duration-200 hover:bg-[#00E5FF]/90 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating…
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update Status
                        </>
                      )}
                    </button>

                    {selectedStatus === alert.status && (
                      <p className="text-[11px] text-slate-600 mt-3 text-center">
                        Select a different status to enable the update.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}
