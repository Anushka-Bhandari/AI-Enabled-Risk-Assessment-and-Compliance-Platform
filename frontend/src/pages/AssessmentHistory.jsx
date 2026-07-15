import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ShieldCheck,
    LayoutDashboard,
    ClipboardList,
    ShieldAlert,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    AlertTriangle,
    Inbox,
    RefreshCw,
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Filter,
    Calendar,
    History
} from "lucide-react";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Same institution directory used on Dashboard, kept here so the table can
// resolve a readable name from university_id.
const UNIVERSITIES = {
    1: "Rajasthan Institute of Technology",
    2: "National University of Governance",
    3: "Metropolitan School of Engineering",
    4: "Coastal State University",
    5: "Northbridge Institute of Compliance Studies",
};

const NAV_ITEMS = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        key: "assessments",
        label: "Assessments",
        icon: ClipboardList,
        path: "/assessments",
    },
];

const RISK_STYLES = {
    High: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500", chart: "#e11d48" },
    Medium: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", chart: "#d97706" },
    Low: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", chart: "#059669" },
    Unknown: { text: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", dot: "bg-slate-400", chart: "#94a3b8" },
};

const STATUS_STYLES = {
    Completed: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
    Pending: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
    Failed: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
    Unknown: { text: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", dot: "bg-slate-400" },
};

const RISK_FILTERS = ["All", "High", "Medium", "Low"];
const PAGE_SIZE = 8;

function formatDate(dateString) {
    if (!dateString) return "—";
    const d = new Date(dateString.replace(" ", "T"));
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getInitials(name) {
    if (!name) return "U";
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function AssessmentHistory() {
    const navigate = useNavigate();

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
            accent: "from-[#0B2A66] to-blue-700",
            trend: `${history.length} on record`,
            trendUp: true,
        },
        {
            label: "High Risk Assessments",
            value: riskCounts.High,
            icon: AlertTriangle,
            accent: "from-red-600 to-rose-600",
            trend: riskCounts.High > 0 ? "Needs attention" : "All clear",
            trendUp: riskCounts.High === 0,
        },
        {
            label: "Medium Risk Assessments",
            value: riskCounts.Medium,
            icon: ShieldAlert,
            accent: "from-amber-500 to-orange-600",
            trend: "Under review",
            trendUp: true,
        },
        {
            label: "Low Risk Assessments",
            value: riskCounts.Low,
            icon: ShieldCheck,
            accent: "from-emerald-600 to-teal-600",
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
                const uniName = (UNIVERSITIES[item.university_id] || "").toLowerCase();
                return (
                    String(item.assessment_id).includes(q) ||
                    String(item.university_id).includes(q) ||
                    uniName.includes(q)
                );
            });
        }

        return rows;
    }, [history, riskFilter, searchQuery]);

    // Reset to page 1 whenever the visible result set changes shape.
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, riskFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredHistory.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    const paginatedHistory = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filteredHistory.slice(start, start + PAGE_SIZE);
    }, [filteredHistory, safePage]);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }, [totalPages]);

    const goToResult = (assessmentId) => {
    navigate("/assessment/result", {
        state: { assessmentId }
    });
};

    return (
        <div className="min-h-screen w-full bg-slate-50 flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`fixed lg:sticky top-0 h-screen w-72 bg-[#0B2A66] text-white z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                    }}
                />

                <div className="relative z-10 flex items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" strokeWidth={2.25} />
                        </div>
                        <span className="font-semibold tracking-wide text-lg">
                            Sentinel<span className="text-emerald-400">Grid</span>
                        </span>
                    </div>
                    <button
                        className="lg:hidden text-blue-200 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="relative z-10 flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.key === "assessments";
                        return (
                            <button
                                key={item.key}
                                onClick={() => {
                                    setSidebarOpen(false);
                                    navigate(item.path);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-white/10 text-white shadow-inner border border-white/10"
                                        : "text-blue-100/70 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                                {item.label}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="relative z-10 px-4 pb-6 pt-2 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-100/70 hover:bg-white/5 hover:text-white transition-all duration-200"
                    >
                        <LogOut className="w-4.5 h-4.5" strokeWidth={2} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TOP NAVBAR */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/70">
                    <div className="flex items-center gap-4 px-4 sm:px-8 py-4">
                        <button
                            className="lg:hidden text-slate-600"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden sm:block">
                            <p className="text-sm text-slate-500">
                                Welcome back,{" "}
                                <span className="font-semibold text-slate-900">
                                    {historyResponse?.user || "…"}
                                </span>
                            </p>
                        </div>

                        <div className="flex-1 max-w-md ml-auto relative">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search assessments, institutions…"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white"
                            />
                        </div>

                        <button className="relative w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0B2A66] hover:border-blue-200 hover:bg-blue-50/60 transition-all duration-200">
                            <Bell className="w-4.5 h-4.5" />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                        </button>

                        <div className="w-10 h-10 rounded-xl bg-[#0B2A66] text-white flex items-center justify-center font-semibold text-sm shadow-md shadow-blue-900/20">
                            {getInitials(historyResponse?.user)}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-8 space-y-8">
                    {error && (
                        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                            <button
                                onClick={fetchHistory}
                                className="flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:text-red-900 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Retry
                            </button>
                        </div>
                    )}

                    {/* HERO */}
                    <section className="relative overflow-hidden rounded-3xl bg-[#0B2A66] text-white p-8 sm:p-10 shadow-xl shadow-blue-900/20">
                        <div
                            className="absolute inset-0 opacity-[0.06]"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                                backgroundSize: "42px 42px",
                            }}
                        />
                        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
                        <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />

                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                            <div className="max-w-xl">
                                <p className="uppercase tracking-[0.2em] text-xs font-semibold text-blue-200/80 mb-3">
                                    Institutional Risk Overview
                                </p>
                                <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
                                    Assessment History
                                </h1>
                                <p className="text-blue-100/80 text-sm leading-relaxed">
                                    Complete record of all institutional risk assessments.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-medium px-4 py-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <ArrowLeft className="w-4 h-4 text-emerald-400" />
                                    Back to Dashboard
                                </button>
                                <button
                                    onClick={fetchHistory}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-medium px-4 py-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw className={`w-4 h-4 text-emerald-400 ${isLoading ? "animate-spin" : ""}`} />
                                    Refresh History
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* SUMMARY CARDS */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-slate-200 mb-5" />
                                    <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
                                    <div className="h-7 w-16 bg-slate-200 rounded" />
                                </div>
                            ))
                            : summaryCards.map((card) => {
                                const Icon = card.icon;
                                return (
                                    <div
                                        key={card.label}
                                        className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <div className="flex items-start justify-between mb-5">
                                            <div
                                                className={`w-11 h-11 rounded-xl bg-linear-to-br ${card.accent} flex items-center justify-center shadow-md`}
                                            >
                                                <Icon className="w-5 h-5 text-white" strokeWidth={2.25} />
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500">{card.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-1">
                                            {card.value}
                                        </p>
                                        <p
                                            className={`text-xs mt-2 ${card.trendUp ? "text-emerald-600" : "text-red-600"
                                                }`}
                                        >
                                            {card.trend}
                                        </p>
                                    </div>
                                );
                            })}
                    </section>

                    {/* SEARCH & FILTERS */}
                    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-5">
                            <Filter className="w-4.5 h-4.5 text-slate-400" />
                            <h3 className="font-semibold text-slate-900">Search &amp; Filters</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="relative lg:col-span-1">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by Assessment ID or Institution…"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white"
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
                                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${isActive
                                                    ? "bg-[#0B2A66] text-white border-[#0B2A66] shadow-sm"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:bg-blue-50/60"
                                                }`}
                                        >
                                            {style && (
                                                <span
                                                    className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-white" : style.dot
                                                        }`}
                                                />
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
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-sm text-slate-400 cursor-not-allowed"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Date range · Coming soon
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* TABLE */}
                    <section className="rounded-2xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <div>
                                <h3 className="font-semibold text-slate-900">All Assessments</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {filteredHistory.length} of {history.length} assessment
                                    {history.length === 1 ? "" : "s"} shown
                                </p>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="p-6 space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />
                                ))}
                            </div>
                        ) : filteredHistory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                    <Inbox className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-sm font-semibold text-slate-700">
                                    No assessments found
                                </p>
                                <p className="text-xs text-slate-400 mt-1 max-w-xs">
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
                                            <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
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
                                                        className="group cursor-pointer border-b border-slate-50 last:border-0 hover:bg-blue-50/40 transition-colors duration-150"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-slate-900">
                                                            #{item.assessment_id}
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600">
                                                            {UNIVERSITIES[item.university_id] ||
                                                                `Institution ${item.university_id}`}
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-900 font-mono font-semibold">
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
                                                        <td className="px-6 py-4 text-slate-500">
                                                            {formatDate(item.submitted_at)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.text} ${statusStyle.bg} ${statusStyle.border}`}
                                                            >
                                                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                                                                {status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0B2A66] group-hover:translate-x-0.5 transition-all duration-200 inline-block" />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* PAGINATION */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100">
                                    <p className="text-xs text-slate-400">
                                        Page {safePage} of {totalPages}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={safePage === 1}
                                            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/60 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </button>

                                        <div className="hidden sm:flex items-center gap-1">
                                            {pageNumbers.map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => setCurrentPage(num)}
                                                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${num === safePage
                                                            ? "bg-[#0B2A66] text-white shadow-sm"
                                                            : "text-slate-600 hover:bg-blue-50/60"
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={safePage === totalPages}
                                            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/60 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
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