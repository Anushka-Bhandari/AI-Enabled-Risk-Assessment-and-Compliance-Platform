import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
    ShieldCheck,
    LayoutDashboard,
    ClipboardList,
    ShieldAlert,
    FileBarChart2,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    ClipboardCheck,
    FileText,
    ScanSearch,
    CheckCircle2,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Activity,
    Inbox,
    RefreshCw,
    History
} from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";

const API_BASE_URL =
    import.meta.env.VITE_API_URL;

// Same institution directory used on the Register page, kept here so the
// Recent Assessments table can resolve a readable name from university_id.
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

    {
        key: "history",
        label: "Assessment History",
        icon: History,
        path: "/assessment-history",
    }


    //   {
    //     key: "risks",
    //     label: "Risks",
    //     icon: ShieldAlert,
    //     path: "/risks",
    //   },
    //   {
    //     key: "reports",
    //     label: "Reports",
    //     icon: FileText,
    //     path: "/reports",
    //   },
    //   {
    //     key: "compliance",
    //     label: "Compliance",
    //     icon: CheckCircle,
    //     path: "/compliance",
    //   },
    //   {
    //     key: "settings",
    //     label: "Settings",
    //     icon: Settings,
    //     path: "/settings",
    //   },
];

const RISK_STYLES = {
    High: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500", chart: "#e11d48" },
    Medium: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", chart: "#d97706" },
    Low: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", chart: "#059669" },
    Unknown: { text: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", dot: "bg-slate-400", chart: "#94a3b8" },
};

function formatDate(dateString) {
    const d = new Date(dateString.replace(" ", "T"));
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function monthLabel(dateString) {
    const d = new Date(dateString.replace(" ", "T"));
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { month: "short" });
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

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [dashboardData, setDashboardData] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const authHeaders = useCallback(() => {
        const token = localStorage.getItem("token");
        return { Authorization: `Bearer ${token}` };
    }, []);

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
                axios.get(`${API_BASE_URL}/dashboard/analytics`, {
                    headers: authHeaders(),
                }),
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
                "Unable to load your dashboard right now. Please try again."
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
        fetchDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const history = dashboardData?.history ?? [];

    // --- Chart-ready data, sourced from the analytics endpoint ----------
    // The API now computes risk breakdown, compliance score, and monthly
    // trend server-side, so the client just reads it — no more guessing
    // risk level from the assessment id.
    const riskCounts = useMemo(
        () => analyticsData?.risk_breakdown ?? { High: 0, Medium: 0, Low: 0 },
        [analyticsData]
    );

    const totalAssessments =
        analyticsData?.total_assessments ?? dashboardData?.total_assessments ?? 0;

    const complianceScore = analyticsData?.compliance_score ?? 100;
    const averageRiskScore = analyticsData?.average_risk_score ?? null;

    // Illustrative until the API exposes dedicated report / control counts.
    const reportsGenerated = Math.max(totalAssessments - riskCounts.High, 0);
    const activeControls = 128;

    const riskTrendData = useMemo(() => {
        const trend = analyticsData?.monthly_trend ?? [];
        return trend.map((m) => ({
            month: monthLabel(`${m.month}-01 00:00:00`),
            High: m.High,
            Medium: m.Medium,
            Low: m.Low,
        }));
    }, [analyticsData]);

    const activityData = useMemo(() => {
        const trend = analyticsData?.monthly_trend ?? [];
        return trend.map((m) => ({
            month: monthLabel(`${m.month}-01 00:00:00`),
            count: m.total,
        }));
    }, [analyticsData]);

    const complianceChartData = [
        { name: "High Risk", value: riskCounts.High, color: RISK_STYLES.High.chart },
        { name: "Medium Risk", value: riskCounts.Medium, color: RISK_STYLES.Medium.chart },
        { name: "Low Risk", value: riskCounts.Low, color: RISK_STYLES.Low.chart },
    ];

    const filteredHistory = useMemo(() => {
        if (!searchQuery.trim()) return history;
        const q = searchQuery.trim().toLowerCase();
        return history.filter((item) => {
            const uniName = (UNIVERSITIES[item.university_id] || "").toLowerCase();
            return (
                String(item.assessment_id).includes(q) ||
                String(item.university_id).includes(q) ||
                uniName.includes(q)
            );
        });
    }, [history, searchQuery]);

    const analyticsCards = [
        {
            label: "Total Assessments",
            value: totalAssessments,
            icon: ClipboardList,
            accent: "from-[#0B2A66] to-blue-700",
            trend: "+12% this quarter",
            trendUp: true,
        },
        {
            label: "High Risks",
            value: riskCounts.High,
            icon: AlertTriangle,
            accent: "from-red-600 to-rose-600",
            trend: riskCounts.High > 0 ? "Needs attention" : "All clear",
            trendUp: riskCounts.High === 0,
        },
        {
            label: "Medium Risks",
            value: riskCounts.Medium,
            icon: ShieldAlert,
            accent: "from-amber-500 to-orange-600",
            trend: "Under review",
            trendUp: true,
        },
        {
            label: "Compliance Score",
            value: `${complianceScore}%`,
            icon: ShieldCheck,
            accent: "from-emerald-600 to-teal-600",
            trend: complianceScore >= 85 ? "Strong posture" : "Improving",
            trendUp: complianceScore >= 85,
        },
        {
            label: "Reports Generated",
            value: reportsGenerated,
            icon: FileBarChart2,
            accent: "from-indigo-600 to-blue-600",
            trend: "+3 this month",
            trendUp: true,
        },
        {
            label: "Active Controls",
            value: activeControls,
            icon: CheckCircle2,
            accent: "from-slate-700 to-slate-900",
            trend: "Mapped & monitored",
            trendUp: true,
        },
    ];

    const quickActions = [
        { label: "New Assessment", icon: ClipboardCheck, onClick: () => navigate("/assessments/new") },
        { label: "Generate Report", icon: FileText, onClick: () => navigate("/reports/new") },
        { label: "View Risks", icon: ScanSearch, onClick: () => setActiveNav("risks") },
        { label: "Compliance Review", icon: ShieldCheck, onClick: () => setActiveNav("compliance") },
    ];

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
                        const isActive =
                            location.pathname === item.path ||
                            (item.path !== "/dashboard" &&
                                location.pathname.startsWith(item.path));
                        return (
                            <button
                                key={item.key}
                                onClick={() => {
                                    setSidebarOpen(false);
                                    console.log("Navigating to:", item.path);
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
                                    {dashboardData?.user || "…"}
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
                            {getInitials(dashboardData?.user)}
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
                                onClick={fetchDashboard}
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
                                    {getGreeting()}
                                    {dashboardData?.user ? `, ${dashboardData.user.split(" ")[0]}` : ""}.
                                </h1>
                                <p className="text-blue-100/80 text-sm leading-relaxed">
                                    {isLoading
                                        ? "Loading your institution's latest governance posture…"
                                        : `Your institution currently holds a ${complianceScore}% compliance score across ${totalAssessments} assessments, with ${riskCounts.High} item${riskCounts.High === 1 ? "" : "s"} flagged as high risk.`}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {quickActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.label}
                                            onClick={action.onClick}
                                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-medium px-4 py-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <Icon className="w-4 h-4 text-emerald-400" />
                                            {action.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* ANALYTICS CARDS */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {isLoading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-slate-200 mb-5" />
                                    <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
                                    <div className="h-7 w-16 bg-slate-200 rounded" />
                                </div>
                            ))
                            : analyticsCards.map((card) => {
                                const Icon = card.icon;
                                const TrendIcon = card.trendUp ? TrendingUp : TrendingDown;
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
                                            <span
                                                className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? "text-emerald-600" : "text-red-600"
                                                    }`}
                                            >
                                                <TrendIcon className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500">{card.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-1">
                                            {card.value}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-2">{card.trend}</p>
                                    </div>
                                );
                            })}
                    </section>

                    {/* CHARTS */}
                    <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                        <div className="xl:col-span-2 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-semibold text-slate-900">Risk Trend</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Assessment risk mix over time
                                    </p>
                                </div>
                                <Activity className="w-4.5 h-4.5 text-slate-400" />
                            </div>
                            {isLoading ? (
                                <div className="h-64 rounded-xl bg-slate-100 animate-pulse" />
                            ) : riskTrendData.length === 0 ? (
                                <EmptyChartState />
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <LineChart data={riskTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 12,
                                                border: "1px solid #e2e8f0",
                                                fontSize: 12,
                                            }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                        <Line type="monotone" dataKey="High" stroke={RISK_STYLES.High.chart} strokeWidth={2.5} dot={{ r: 3 }} />
                                        <Line type="monotone" dataKey="Medium" stroke={RISK_STYLES.Medium.chart} strokeWidth={2.5} dot={{ r: 3 }} />
                                        <Line type="monotone" dataKey="Low" stroke={RISK_STYLES.Low.chart} strokeWidth={2.5} dot={{ r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="font-semibold text-slate-900">Compliance Overview</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Risk distribution</p>
                            </div>
                            {isLoading ? (
                                <div className="h-64 rounded-xl bg-slate-100 animate-pulse" />
                            ) : totalAssessments === 0 ? (
                                <EmptyChartState />
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={complianceChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={4}
                                        >
                                            {complianceChartData.map((entry) => (
                                                <Cell key={entry.name} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 12,
                                                border: "1px solid #e2e8f0",
                                                fontSize: 12,
                                            }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="xl:col-span-3 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-semibold text-slate-900">Assessment Activity</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Submissions per month
                                    </p>
                                </div>
                            </div>
                            {isLoading ? (
                                <div className="h-56 rounded-xl bg-slate-100 animate-pulse" />
                            ) : activityData.length === 0 ? (
                                <EmptyChartState />
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={activityData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 12,
                                                border: "1px solid #e2e8f0",
                                                fontSize: 12,
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#0B2A66" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </section>

                    {/* TABLE + RISK PANEL */}
                    <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                        <div className="xl:col-span-2 rounded-2xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Recent Assessments
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Latest submissions across your institution
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/assessment-history")}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    View All
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="p-6 space-y-3">
                                    {Array.from({ length: 4 }).map((_, i) => (
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
                                        {searchQuery
                                            ? "Try a different search term."
                                            : "Once assessments are submitted, they'll appear here."}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                                                <th className="px-6 py-3 font-medium">Assessment ID</th>
                                                <th className="px-6 py-3 font-medium">Institution</th>
                                                <th className="px-6 py-3 font-medium">Submitted</th>
                                                <th className="px-6 py-3 font-medium">Risk Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHistory.slice(0, 5).map((item) => {
                                                const level = item.risk_level || "Unknown";
                                                const style = RISK_STYLES[level] || RISK_STYLES.Unknown;
                                                return (
                                                    <tr
                                                        key={item.assessment_id}
                                                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors duration-150"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-slate-900">
                                                            #{item.assessment_id}
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600">
                                                            {UNIVERSITIES[item.university_id] ||
                                                                `Institution ${item.university_id}`}
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-500">
                                                            {formatDate(item.submitted_at)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.text} ${style.bg} ${style.border}`}
                                                            >
                                                                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                                                {level}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* RISK OVERVIEW PANEL */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <h3 className="font-semibold text-slate-900 mb-1">Risk Overview</h3>
                            <p className="text-xs text-slate-400 mb-6">
                                Breakdown across all assessments
                            </p>

                            {isLoading ? (
                                <div className="space-y-5">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {["High", "Medium", "Low"].map((level) => {
                                        const style = RISK_STYLES[level];
                                        const count = riskCounts[level];
                                        const pct = totalAssessments
                                            ? Math.round((count / totalAssessments) * 100)
                                            : 0;
                                        return (
                                            <div key={level}>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className={`text-sm font-medium ${style.text}`}>
                                                        {level} Risk
                                                    </span>
                                                    <span className="text-sm text-slate-500">
                                                        {count} · {pct}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${style.dot} transition-all duration-500`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-xs text-slate-400 mb-3">Quick actions</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {quickActions.map((action) => {
                                        const Icon = action.icon;
                                        return (
                                            <button
                                                key={action.label}
                                                onClick={action.onClick}
                                                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 py-3 px-2 text-center hover:border-blue-200 hover:bg-blue-50/60 transition-all duration-200 group"
                                            >
                                                <Icon className="w-4.5 h-4.5 text-[#0B2A66] group-hover:scale-110 transition-transform duration-200" />
                                                <span className="text-[11px] font-medium text-slate-600 leading-tight">
                                                    {action.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

function EmptyChartState() {
    return (
        <div className="h-56 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <Activity className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">No data yet</p>
            <p className="text-xs text-slate-400 mt-1">
                This chart will populate once assessments are submitted.
            </p>
        </div>
    );
}