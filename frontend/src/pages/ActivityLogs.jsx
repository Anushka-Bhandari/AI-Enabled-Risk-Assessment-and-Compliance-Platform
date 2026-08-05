import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getActivityLogs, getActivityLogById } from "../services/activityLogService";
import "./ActivityLogs.css";

/* ------------------------------------------------------------------ */
/*  Sidebar nav — same routes as the rest of the Command Center.        */
/*  DO NOT add new routes here, only link to ones that already exist.   */
/* ------------------------------------------------------------------ */

const NAV_SECTIONS = [
  {
    section: "OPERATIONS",
    items: [
      { key: "dashboard", label: "Dashboard", icon: "dashboard", path: "/SecurityCommandCenter" },
      { key: "activity-logs", label: "Activity Logs", icon: "logs", path: "/activity-logs" },
      { key: "alerts", label: "Alerts", icon: "alert", path: "/alerts" },
      { key: "investigations", label: "Investigations", icon: "search", path: "/investigations" },
    ],
  },
  {
    section: "MONITORING",
    items: [
      { key: "faculty-activity", label: "Faculty Activity", icon: "users", path: "/faculty-activity" },
      { key: "departments", label: "Departments", icon: "building", path: "/departments" },
      { key: "event-stream", label: "Event Stream", icon: "radio", path: "/event-stream" },
    ],
  },
  {
    section: "ASSESSMENT",
    items: [
      { key: "new-assessment", label: "New Assessment", icon: "clipboard", path: "/assessments/new" },
      { key: "assessment-history", label: "Assessment History", icon: "history", path: "/assessment-history" },
      { key: "compliance-reports", label: "Compliance Reports", icon: "report", path: "/compliance-reports" },
    ],
  },
  {
    section: "SETTINGS",
    items: [{ key: "configuration", label: "Configuration", icon: "settings", path: "/configuration" }],
  },
];

const ICON_PATHS = {
  dashboard: <path d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z" />,
  logs: (
    <>
      <path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14" />
      <path d="M4 19h16M8 19v-4M12 19v-7M16 19v-10" strokeLinecap="round" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" strokeLinecap="round" />
      <path d="M16 8.2a3 3 0 1 1 3.6 2.9M21 20c0-2.8-1.7-5-4-5.8" strokeLinecap="round" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="10" height="18" rx="1" />
      <path d="M8 7h2M8 11h2M8 15h2M17 21v-8h3v8M17 13v-1h3v1" />
    </>
  ),
  radio: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
      <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7v5l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  report: (
    <>
      <path d="M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M8 12h8M8 16h8M8 8h3" strokeLinecap="round" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  chevronRight: <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />,
  close: <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />,
  shield: (
    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" strokeLinejoin="round" />
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" strokeLinejoin="round" />
      <path d="M9.5 20a2.5 2.5 0 0 0 5 0" strokeLinecap="round" />
    </>
  ),
};

function Icon({ name, className, size = 16, strokeWidth = 2 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Activity Logs domain helpers                                       */
/* ------------------------------------------------------------------ */

const STATUS_LABEL = {
  SUCCESS: "Success",
  FAILED: "Failed",
  WARNING: "Warning",
};

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
  return name
    .replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusBadge({ status }) {
  if (!status) return <span className="al-badge al-badge--status-unknown">Unknown</span>;
  const key = status.toLowerCase();
  return <span className={`al-badge al-badge--status-${key}`}>{STATUS_LABEL[status] || status}</span>;
}

function EventTypeBadge({ type }) {
  if (!type) return <span className="al-badge al-badge--type-unknown">Unknown</span>;
  const key = type.toLowerCase();
  return <span className={`al-badge al-badge--type-${key}`}>{type.replace(/_/g, " ")}</span>;
}

export default function ActivityLogs() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  const [selectedLog, setSelectedLog] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const fetchLogs = useCallback(async ({ silent } = {}) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setLoadError("");

    try {
      const data = await getActivityLogs();
      setLogs(Array.isArray(data) ? data : []);
      setLastRefreshed(new Date());
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to load activity logs right now. Please try again.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleRefresh = () => {
    fetchLogs({ silent: true });
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const handleRowClick = async (log) => {
    setSelectedLog(log);
    setDetailError("");
    setDetailLoading(true);
    try {
      const detail = await getActivityLogById(log.id);
      setSelectedLog(detail);
    } catch (err) {
      // Keep showing the row data we already have; just surface the
      // refresh failure quietly inside the drawer.
      setDetailError(
        err?.response?.data?.message || "Could not refresh full event details from the server."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDrawer = () => {
    setSelectedLog(null);
    setDetailError("");
  };

  // Filter option lists are derived from whatever the backend actually
  // returns, since there's no dedicated options endpoint.
  const eventTypeOptions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.event_type).filter(Boolean))).sort(),
    [logs]
  );
  const statusOptions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.status).filter(Boolean))).sort(),
    [logs]
  );
  const departmentOptions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.department).filter(Boolean))).sort(),
    [logs]
  );

  const filteredLogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesSearch =
        !term ||
        (log.event_id || "").toLowerCase().includes(term) ||
        (log.user_name || "").toLowerCase().includes(term) ||
        (log.user_email || "").toLowerCase().includes(term);
      const matchesType = eventTypeFilter === "ALL" || log.event_type === eventTypeFilter;
      const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;
      const matchesDepartment = departmentFilter === "ALL" || log.department === departmentFilter;
      return matchesSearch && matchesType && matchesStatus && matchesDepartment;
    });
  }, [logs, searchTerm, eventTypeFilter, statusFilter, departmentFilter]);

  const stats = useMemo(() => {
    const total = logs.length;
    const failed = logs.filter((l) => l.status === "FAILED").length;
    const auth = logs.filter((l) => l.event_type === "AUTHENTICATION").length;
    const uniqueUsers = new Set(logs.map((l) => l.user_email).filter(Boolean)).size;
    return { total, failed, auth, uniqueUsers };
  }, [logs]);

  return (
    <div className="al-shell">
      {sidebarOpen && <div className="al-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* ================= SIDEBAR (existing Command Center nav) ================= */}
      <aside className={`al-sidebar ${sidebarOpen ? "al-sidebar--open" : ""}`}>
        <div className="al-sidebar-grid" />

        <div className="al-sidebar-header">
          <div className="al-sidebar-brand">
            <div className="al-sidebar-logo">
              <span className="al-sidebar-logo-ping" />
              <Icon name="shield" size={18} strokeWidth={2.25} className="al-icon-cyan" />
            </div>
            <div>
              <p className="al-sidebar-title">CommandCenter</p>
              <p className="al-sidebar-subtitle">Univ. Security Ops</p>
            </div>
          </div>
          <button className="al-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className="al-sidebar-nav">
          {NAV_SECTIONS.map((group) => (
            <div key={group.section} className="al-nav-group">
              <p className="al-nav-group-title">{group.section}</p>
              <div className="al-nav-list">
                {group.items.map((item) => {
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
                      className={`al-nav-item ${isActive ? "al-nav-item--active" : ""}`}
                    >
                      <Icon name={item.icon} size={16} className="al-nav-item-icon" />
                      {item.label}
                      {isActive && <Icon name="chevronRight" size={14} className="al-nav-item-chevron" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="al-sidebar-footer">
          <button className="al-nav-item al-nav-item--signout" onClick={handleLogout}>
            <Icon name="logout" size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ================= CONTENT ================= */}
      <div className="al-content-wrap">
        {/* TOPBAR */}
        <header className="al-topbar">
          <button className="al-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Icon name="menu" size={22} />
          </button>

          <div className="al-topbar-titles">
            <nav className="al-breadcrumb" aria-label="Breadcrumb">
              <button className="al-breadcrumb-link" onClick={() => navigate("/SecurityCommandCenter")}>
                Dashboard
              </button>
              <span className="al-breadcrumb-sep">/</span>
              <span className="al-breadcrumb-current">Activity Logs</span>
            </nav>
            <h1 className="al-topbar-title">Activity Logs</h1>
          </div>

          <div className="al-topbar-actions">
            <button className="al-back-btn" onClick={() => navigate("/SecurityCommandCenter")}>
              <Icon name="chevronRight" size={14} className="al-back-btn-icon" />
              Back to Dashboard
            </button>
            <div className="al-status-pill">
              <span className="al-status-dot" />
              SYSTEM ONLINE
            </div>
            <button className="al-icon-btn" aria-label="Notifications">
              <Icon name="bell" size={17} />
              <span className="al-icon-btn-dot" />
            </button>
            <div className="al-avatar">KB</div>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="al-main">
          <p className="al-subtitle">Monitor and investigate all university security events.</p>

          {/* ================= TOOLBAR ================= */}
          <div className="al-toolbar">
            <div className="al-search">
              <Icon name="search" size={16} className="al-search-icon" />
              <input
                type="text"
                placeholder="Search by event ID, user name, or email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="al-search-input"
              />
            </div>

            <div className="al-filters">
              <select
                className="al-select"
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
              >
                <option value="ALL">All Event Types</option>
                {eventTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>

              <select className="al-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABEL[status] || status}
                  </option>
                ))}
              </select>

              <select
                className="al-select"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="ALL">All Departments</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <button className="al-refresh-btn" onClick={handleRefresh} disabled={isRefreshing || isLoading}>
                <svg
                  className={`al-refresh-icon ${isRefreshing ? "al-spin" : ""}`}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 12a8 8 0 0 1 14.9-4M20 12a8 8 0 0 1-14.9 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path d="M17 4v5h-5M7 20v-5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <p className="al-refreshed-at">
            {lastRefreshed
              ? `Last refreshed ${lastRefreshed.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}`
              : "\u00A0"}
          </p>

          {/* ================= ERROR STATE ================= */}
          {loadError && (
            <div className="al-error-banner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="al-error-banner-text">
                <p>{loadError}</p>
              </div>
              <button className="al-retry-btn" onClick={() => fetchLogs()}>
                Retry
              </button>
            </div>
          )}

          {/* ================= LOADING STATE ================= */}
          {isLoading ? (
            <div className="al-loading-state">
              <span className="al-loading-spinner" />
              <p>Loading activity logs…</p>
            </div>
          ) : !loadError && logs.length === 0 ? (
            /* ================= EMPTY STATE ================= */
            <div className="al-empty-state">
              <div className="al-empty-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 12h6M9 15h6M9 9h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p className="al-empty-title">No activity logs yet</p>
              <p className="al-empty-detail">
                Security events will appear here as soon as they're recorded.
              </p>
            </div>
          ) : !loadError ? (
            <>
              {/* ================= STATS CARDS ================= */}
              <div className="al-stats-grid">
                <div className="al-stat-card al-stat-card--cyan">
                  <div className="al-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14" stroke="currentColor" strokeWidth="2" />
                      <path d="M4 19h16M8 19v-4M12 19v-7M16 19v-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="al-stat-label">Total Events</p>
                  <p className="al-stat-value">{stats.total.toLocaleString()}</p>
                </div>

                <div className="al-stat-card al-stat-card--red">
                  <div className="al-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="al-stat-label">Failed Events</p>
                  <p className="al-stat-value">{stats.failed.toLocaleString()}</p>
                </div>

                <div className="al-stat-card al-stat-card--indigo">
                  <div className="al-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <p className="al-stat-label">Authentication Events</p>
                  <p className="al-stat-value">{stats.auth.toLocaleString()}</p>
                </div>

                <div className="al-stat-card al-stat-card--emerald">
                  <div className="al-stat-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="al-stat-label">Unique Users</p>
                  <p className="al-stat-value">{stats.uniqueUsers.toLocaleString()}</p>
                </div>
              </div>

              {/* ================= ACTIVITY TABLE ================= */}
              <div className="al-table-panel">
                <div className="al-table-scroll">
                  <table className="al-table">
                    <thead>
                      <tr>
                        <th>Event ID</th>
                        <th>User</th>
                        <th>Event Type</th>
                        <th>Event Name</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log) => (
                        <tr key={log.id} onClick={() => handleRowClick(log)} className="al-row">
                          <td className="al-mono">{log.event_id}</td>
                          <td>
                            <div className="al-user-cell">
                              <span className="al-user-avatar">{getInitials(log.user_name)}</span>
                              <span>{log.user_name || "Unknown"}</span>
                            </div>
                          </td>
                          <td>
                            <EventTypeBadge type={log.event_type} />
                          </td>
                          <td>{log.event_name}</td>
                          <td className="al-muted">{log.department || "—"}</td>
                          <td>
                            <StatusBadge status={log.status} />
                          </td>
                          <td className="al-muted">{log.location || "—"}</td>
                          <td className="al-mono al-muted">{formatTimestamp(log.timestamp)}</td>
                        </tr>
                      ))}

                      {filteredLogs.length === 0 && (
                        <tr>
                          <td colSpan={8} className="al-empty-row">
                            No events match your current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>

      {/* ================= DETAILS DRAWER ================= */}
      {selectedLog && (
        <>
          <div className="al-drawer-backdrop" onClick={closeDrawer} />
          <aside className="al-drawer">
            <div className="al-drawer-header">
              <div>
                <p className="al-drawer-eyebrow">Event Details</p>
                <h2 className="al-drawer-title">{selectedLog.event_name}</h2>
              </div>
              <button className="al-drawer-close" onClick={closeDrawer} aria-label="Close">
                ×
              </button>
            </div>

            <div className="al-drawer-body">
              {detailLoading && (
                <div className="al-drawer-loading">
                  <span className="al-loading-spinner al-loading-spinner--sm" />
                  Refreshing full event details…
                </div>
              )}
              {detailError && <div className="al-drawer-error">{detailError}</div>}

              <section className="al-drawer-section">
                <h3 className="al-drawer-section-title">Event Information</h3>
                <div className="al-kv-grid">
                  <div className="al-kv">
                    <span className="al-kv-label">Event ID</span>
                    <span className="al-kv-value al-mono">{selectedLog.event_id}</span>
                  </div>
                  <div className="al-kv">
                    <span className="al-kv-label">Event Type</span>
                    <span className="al-kv-value">
                      <EventTypeBadge type={selectedLog.event_type} />
                    </span>
                  </div>
                  <div className="al-kv">
                    <span className="al-kv-label">Event Name</span>
                    <span className="al-kv-value">{selectedLog.event_name}</span>
                  </div>
                  <div className="al-kv">
                    <span className="al-kv-label">Timestamp</span>
                    <span className="al-kv-value al-mono">{formatTimestamp(selectedLog.timestamp)}</span>
                  </div>
                  <div className="al-kv">
                    <span className="al-kv-label">Status</span>
                    <span className="al-kv-value">
                      <StatusBadge status={selectedLog.status} />
                    </span>
                  </div>
                </div>
              </section>

              <section className="al-drawer-section">
                <h3 className="al-drawer-section-title">User Information</h3>
                <div className="al-kv-grid">
                  <div className="al-kv">
                    <span className="al-kv-label">Name</span>
                    <span className="al-kv-value">{selectedLog.user_name || "—"}</span>
                  </div>
                  <div className="al-kv">
                    <span className="al-kv-label">Email</span>
                    <span className="al-kv-value al-mono">{selectedLog.user_email || "—"}</span>
                  </div>
                  <div className="al-kv">
                    <span className="al-kv-label">Role</span>
                    <span className="al-kv-value">{selectedLog.role || "—"}</span>
                  </div>
                  <div className="al-kv">
                    <span className="al-kv-label">Department</span>
                    <span className="al-kv-value">{selectedLog.department || "—"}</span>
                  </div>
                </div>
              </section>

              <section className="al-drawer-section">
                <h3 className="al-drawer-section-title">Device Information</h3>
                <div className="al-kv-grid">
                  <div className="al-kv">
                    <span className="al-kv-label">Device</span>
                    <span className="al-kv-value">{selectedLog.device || "—"}</span>
                  </div>
                  <div className="al-kv">
                    <span className="al-kv-label">IP Address</span>
                    <span className="al-kv-value al-mono">{selectedLog.ip_address || "—"}</span>
                  </div>
                  <div className="al-kv">
                    <span className="al-kv-label">Location</span>
                    <span className="al-kv-value">{selectedLog.location || "—"}</span>
                  </div>
                </div>
              </section>

              <section className="al-drawer-section">
                <h3 className="al-drawer-section-title">Resource Information</h3>
                <div className="al-kv-grid al-kv-grid--single">
                  <div className="al-kv">
                    <span className="al-kv-label">Resource Accessed</span>
                    <span className="al-kv-value al-mono al-wrap">{selectedLog.resource || "—"}</span>
                  </div>
                </div>
              </section>

              <section className="al-drawer-section">
                <h3 className="al-drawer-section-title">Metadata</h3>
                <pre className="al-metadata-block">
                  {selectedLog.event_metadata
                    ? JSON.stringify(selectedLog.event_metadata, null, 2)
                    : "No metadata available"}
                </pre>
              </section>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}