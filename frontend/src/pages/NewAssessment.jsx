import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowLeft,
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
  ClipboardList,
  FileUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  ListChecks,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ------------------------------------------------------------------ */
/*  Design tokens — matches SecurityCommandCenter.jsx / QuestionnaireAssessment.jsx */
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

const QUICK_STATS = [
  { key: "questions", label: "Assessment Questions", value: "30+", icon: ListChecks, accent: "text-cyan-300", ring: "border-cyan-400/20", glow: "rgba(34,211,238,0.4)" },
  { key: "compliance", label: "Compliance Checks", value: "15", icon: CheckCircle2, accent: "text-emerald-300", ring: "border-emerald-400/20", glow: "rgba(16,185,129,0.4)" },
  { key: "risk", label: "Risk Categories", value: "8", icon: ShieldAlert, accent: "text-red-300", ring: "border-red-400/20", glow: "rgba(248,113,113,0.4)" },
];

const METHOD_HIGHLIGHTS = [
  "Questionnaire assessment evaluates compliance through 30 structured questions.",
  "Document assessment analyzes uploaded institutional documents.",
  "Both methods generate risk level and compliance score.",
  "Results include recommendations for improving cybersecurity posture.",
];

const COMPARISON_ROWS = [
  { feature: "Compliance Review", questionnaire: true, document: true },
  { feature: "AI Analysis", questionnaire: false, document: true },
  { feature: "Manual Input", questionnaire: true, document: false },
];

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function NewAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                <ClipboardCheck className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                  New Assessment
                </h1>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Choose how you want to evaluate institutional risk
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">

  <button
    onClick={() => navigate("/SecurityCommandCenter")}
    className="flex items-center gap-2 px-4 py-2 rounded-xl 
    bg-cyan-400/10 border border-cyan-400/30 
    text-cyan-300 text-sm font-medium
    hover:bg-cyan-400/20 hover:text-white
    transition-all duration-200"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to Dashboard
  </button>

  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 flex items-center justify-center font-semibold text-xs">
    {getInitials("Security Admin")}
  </div>

</div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 space-y-6">
          {/* ================= HERO ================= */}
          <section className="relative rounded-2xl border border-cyan-400/20 bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10 overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)",
                backgroundSize: "34px 34px",
              }}
            />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                New Assessment
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
                Select an assessment method to evaluate cybersecurity, compliance, and
                AI governance risks.
              </p>
            </div>
          </section>

          {/* ================= ASSESSMENT OPTIONS ================= */}
          <section className="grid md:grid-cols-2 gap-5">
            {/* Questionnaire Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => navigate("/questionnaire-assessment")}
              className="cursor-pointer rounded-2xl border border-cyan-400/20 bg-white/[0.03] backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-14px_rgba(34,211,238,0.55)]"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mb-5">
                <ClipboardList className="w-6 h-6 text-cyan-300" strokeWidth={2} />
              </div>

              <h3 className="text-xl font-semibold text-white">
                Questionnaire Assessment
              </h3>

              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Complete a structured cybersecurity and compliance questionnaire to
                evaluate institutional risk posture.
              </p>

              <button className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#020817] bg-cyan-400 shadow-[0_0_20px_-6px_rgba(34,211,238,0.7)] transition-all duration-200 hover:bg-cyan-300">
                Start Questionnaire
              </button>
            </motion.div>

            {/* Document Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              onClick={() => navigate("/upload-assessment")}
              className="cursor-pointer rounded-2xl border border-emerald-400/20 bg-white/[0.03] backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-14px_rgba(16,185,129,0.55)]"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mb-5">
                <FileUp className="w-6 h-6 text-emerald-300" strokeWidth={2} />
              </div>

              <h3 className="text-xl font-semibold text-white">
                Document Assessment
              </h3>

              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Upload university policies, compliance reports, and security
                documents for automated risk analysis.
              </p>

              <button className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#020817] bg-emerald-400 shadow-[0_0_20px_-6px_rgba(16,185,129,0.7)] transition-all duration-200 hover:bg-emerald-300">
                Upload Documents
              </button>
            </motion.div>
          </section>

          {/* ================= QUICK STATS ================= */}
          <section className="grid sm:grid-cols-3 gap-5">
            {QUICK_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={`relative rounded-2xl border ${stat.ring} bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 40px -14px ${stat.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 0px 0 transparent";
                  }}
                >
                  <Icon className={`w-5 h-5 ${stat.accent} mb-4`} strokeWidth={2} />
                  <p className="text-xs font-medium text-slate-400 tracking-wide">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-1.5 font-mono ${stat.accent}`}>{stat.value}</p>
                </motion.div>
              );
            })}
          </section>

          {/* ================= ASSESSMENT METHODS INFO ================= */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <HelpCircle className="w-4.5 h-4.5 text-cyan-400/70" />
              <h3 className="text-sm font-semibold text-white">Assessment Methods</h3>
            </div>

            <ul className="space-y-3">
              {METHOD_HIGHLIGHTS.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  {line}
                </li>
              ))}
            </ul>
          </section>

          {/* ================= COMPARISON TABLE ================= */}
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Compare Assessment Methods</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                What each method covers, side by side
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-white/[0.06] font-mono">
                    <th className="px-6 py-3 font-medium">Feature</th>
                    <th className="px-6 py-3 font-medium text-center">Questionnaire</th>
                    <th className="px-6 py-3 font-medium text-center">Document Upload</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-slate-300">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {row.questionnaire ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 inline-block" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-600 inline-block" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.document ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 inline-block" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-600 inline-block" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}