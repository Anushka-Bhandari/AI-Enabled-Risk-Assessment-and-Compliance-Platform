import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  Radio,
  Radar,
  Activity,
  Users,
  ShieldAlert,
  Gauge,
  Bell,
  Eye,
  Fingerprint,
  BrainCircuit,
  BarChart3,
  Cpu,
  Database,
  GraduationCap,
  Landmark,
  FileSpreadsheet,
  ServerCog,
  BookOpenCheck,
  CalendarCheck2,
  Network,
  Wifi,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lock,
  Sparkles,
  CheckCircle2,
  Mail,
  Globe2,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens — same palette as the Command Center dashboard        */
/*  bg-deep   #020817   page background                                */
/*  bg-panel  #0B1120   panel / card surfaces                          */
/*  accent    cyan  #22D3EE   primary glow / signature                  */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Live Overview", id: "overview" },
  { label: "Capabilities", id: "capabilities" },
  { label: "How It Works", id: "workflow" },
  { label: "Event Stream", id: "event-stream" },
  { label: "Coverage", id: "coverage" },
];

const LIVE_METRICS = [
  { key: "events", label: "Events Processed Today", value: 128460, suffix: "", icon: Activity, accent: "cyan" },
  { key: "threats", label: "Threats Detected", value: 37, suffix: "", icon: ShieldAlert, accent: "red" },
  { key: "users", label: "Active Users", value: 2418, suffix: "", icon: Users, accent: "emerald" },
  { key: "incidents", label: "Security Incidents", value: 6, suffix: "", icon: AlertTriangle, accent: "amber" },
  { key: "compliance", label: "Compliance Score", value: 92, suffix: "%", icon: Gauge, accent: "indigo" },
  { key: "alerts", label: "Risk Alerts Generated", value: 54, suffix: "", icon: Bell, accent: "cyan" },
];

const CAPABILITIES = [
  {
    icon: Radio,
    title: "Live Event Monitoring",
    description: "Every login, file access, and privilege change streamed to your SOC console in real time.",
  },
  {
    icon: ShieldAlert,
    title: "Threat Detection Engine",
    description: "Detects malware signatures, unknown devices, and unauthorized IPs the moment they surface.",
  },
  {
    icon: Fingerprint,
    title: "User Activity Intelligence",
    description: "Behavioral baselines flag anomalies across faculty, staff, and student accounts automatically.",
  },
  {
    icon: BookOpenCheck,
    title: "Compliance Monitoring",
    description: "Continuous posture tracking against governance frameworks — no manual audit cycles required.",
  },
  {
    icon: BrainCircuit,
    title: "AI Risk Analysis",
    description: "LLM-driven analysis correlates signals across systems to score institutional risk in real time.",
  },
  {
    icon: BarChart3,
    title: "Security Analytics Dashboard",
    description: "One command center for alerts, activity trends, and compliance — built for SOC analysts.",
  },
];

const WORKFLOW_STEPS = [
  { icon: Radio, title: "Events Collected", description: "Logins, file access, and network activity ingested across every connected system." },
  { icon: BrainCircuit, title: "AI Analysis", description: "Signals are correlated and scored against known threat and anomaly patterns." },
  { icon: ShieldAlert, title: "Threat Detection", description: "Malware, unknown devices, and privilege escalation attempts are flagged instantly." },
  { icon: Gauge, title: "Risk Scoring", description: "Each finding is weighted into a live institutional risk score." },
  { icon: Bell, title: "Security Alerts", description: "High-priority findings are pushed to your team the moment they're confirmed." },
  { icon: Eye, title: "Administrator Dashboard", description: "Every signal, score, and alert converges into one command center view." },
];

const LIVE_EVENTS = [
  { time: "06:12:55", label: "PRIVILEGE ESCALATION DETECTED", level: "critical" },
  { time: "06:12:49", label: "USER LOGIN SUCCESS", level: "info" },
  { time: "06:12:40", label: "DATABASE DOWNLOAD", level: "warning" },
  { time: "06:12:35", label: "UNKNOWN DEVICE DETECTED", level: "warning" },
  { time: "06:12:32", label: "MALWARE DETECTED", level: "critical" },
  { time: "06:12:25", label: "FAILED LOGIN ATTEMPT", level: "warning" },
];

const EVENT_LEVEL_STYLES = {
  info: { dot: "bg-emerald-400", text: "text-emerald-300" },
  warning: { dot: "bg-amber-400", text: "text-amber-300" },
  critical: { dot: "bg-red-400", text: "text-red-300" },
};

const COVERAGE_NODES = [
  { icon: GraduationCap, label: "Student Portal" },
  { icon: Users, label: "Faculty Portal" },
  { icon: Landmark, label: "Finance Database" },
  { icon: FileSpreadsheet, label: "Examination System" },
  { icon: ServerCog, label: "ERP Platform" },
  { icon: Database, label: "Research Repository" },
  { icon: CalendarCheck2, label: "Attendance System" },
  { icon: Wifi, label: "VPN Gateway" },
];

const RISK_TRENDS = [
  { label: "High", pct: 11, color: "#ef4444" },
  { label: "Medium", pct: 29, color: "#f59e0b" },
  { label: "Low", pct: 60, color: "#10b981" },
];

const THREAT_CATEGORIES = [
  { label: "Credential Attacks", value: 34 },
  { label: "Unauthorized Access", value: 26 },
  { label: "Malware", value: 18 },
  { label: "Privilege Escalation", value: 14 },
  { label: "Data Exfiltration", value: 8 },
];

const ANOMALIES = [
  "Faculty account accessed from 3 countries within 1 hour",
  "Unusual bulk download from Research Repository at 2 AM",
  "Repeated failed MFA challenges on 2 admin accounts",
];

const ACCENT_MAP = {
  cyan: { text: "text-cyan-300", ring: "border-cyan-400/20", glow: "rgba(34,211,238,0.45)", bg: "bg-cyan-400/10" },
  red: { text: "text-red-300", ring: "border-red-400/20", glow: "rgba(248,113,113,0.45)", bg: "bg-red-400/10" },
  emerald: { text: "text-emerald-300", ring: "border-emerald-400/20", glow: "rgba(16,185,129,0.4)", bg: "bg-emerald-400/10" },
  amber: { text: "text-amber-300", ring: "border-amber-400/20", glow: "rgba(245,158,11,0.4)", bg: "bg-amber-400/10" },
  indigo: { text: "text-indigo-300", ring: "border-indigo-400/20", glow: "rgba(129,140,248,0.4)", bg: "bg-indigo-400/10" },
};

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/* ------------------------------------------------------------------ */
/*  Reusable pieces                                                     */
/* ------------------------------------------------------------------ */

function GridOverlay({ className = "" }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}

function SectionEyebrow({ children }) {
  return (
    <p className="flex items-center gap-2 uppercase tracking-[0.22em] text-xs font-semibold text-cyan-400/80 mb-3 font-mono">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" />
      {children}
    </p>
  );
}

function AnimatedCounter({ target, suffix = "", duration = 1400 }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  const start = () => {
    if (started) return;
    setStarted(true);
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <motion.span onViewportEnter={start} viewport={{ once: true, amount: 0.6 }}>
      {value.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState(0);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroFade = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const heroShift = useTransform(scrollYProgress, [0, 1], [0, 50]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Staggered terminal reveal for the live event stream preview.
  useEffect(() => {
    if (visibleEvents >= LIVE_EVENTS.length) return;
    const timeout = setTimeout(() => setVisibleEvents((v) => v + 1), 550);
    return () => clearTimeout(timeout);
  }, [visibleEvents]);

  const handleNavClick = (id) => {
    setMobileOpen(false);
    scrollToId(id);
  };

  return (
    <div className="min-h-screen w-full bg-[#020817] text-slate-200 overflow-x-hidden font-sans antialiased">
      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B1120]/85 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
              <span className="absolute inset-0 rounded-xl border border-cyan-400/40 animate-ping opacity-40" />
              <ShieldCheck className="w-4.5 h-4.5 text-cyan-300" strokeWidth={2.25} />
            </div>
            <span className="font-semibold tracking-wide text-lg text-white">
              Command<span className="text-cyan-400">Center</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/[0.04] transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 bg-cyan-400 text-[#020817] text-sm font-semibold px-5 py-2.5 rounded-xl shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] transition-all duration-300 hover:bg-cyan-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              Launch Security Center
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button className="lg:hidden text-slate-300" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#0B1120] border-t border-white/[0.06] px-4 py-4 space-y-1"
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 border border-white/10"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-center bg-cyan-400 text-[#020817] text-sm font-semibold px-4 py-2.5 rounded-xl"
                >
                  Launch Security Center
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================= SECTION 1 — HERO ================= */}
      <section ref={heroRef} className="relative pt-40 pb-28 sm:pt-48 sm:pb-36 overflow-hidden">
        <GridOverlay className="opacity-[0.07]" />
        <div className="absolute -top-32 -right-24 w-[30rem] h-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-16 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* radar sweep */}
        <motion.div
          className="absolute top-24 right-[8%] w-64 h-64 rounded-full border border-cyan-400/10 hidden lg:block pointer-events-none"
          style={{ opacity: 0.5 }}
        >
          <div className="absolute inset-6 rounded-full border border-cyan-400/10" />
          <div className="absolute inset-12 rounded-full border border-cyan-400/10" />
          <motion.div
            className="absolute inset-0 origin-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-1/2 h-1/2 origin-bottom-right bg-gradient-to-tl from-cyan-400/25 to-transparent rounded-tl-full" />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: heroFade, y: heroShift }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div initial="hidden" animate="show" variants={staggerContainer}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-semibold tracking-wide text-emerald-300 font-mono">
                LIVE MONITORING ACTIVE
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.08] mb-6 text-white tracking-tight">
              AI-Powered Security Monitoring for Modern Universities
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mb-9">
              Detect threats, monitor user activity, track compliance, and protect critical
              university infrastructure in real time.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 bg-cyan-400 text-[#020817] text-sm font-semibold px-6 py-3.5 rounded-xl shadow-[0_0_28px_-6px_rgba(34,211,238,0.7)] transition-all duration-300 hover:bg-cyan-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                Launch Security Center
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToId("event-stream")}
                className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-sm font-semibold px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Radar className="w-4.5 h-4.5 text-cyan-300" />
                View Live Monitoring
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-6 mt-10 text-slate-500 text-xs">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-300" /> JWT + OTP secured
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> AI-driven threat analysis
              </span>
            </motion.div>
          </motion.div>

          {/* Live SOC dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden sm:block"
          >
            <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl p-6 max-w-md mx-auto overflow-hidden">
              <GridOverlay className="opacity-[0.04]" />
              <div className="relative flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] text-slate-500 font-mono">SOC OVERVIEW</p>
                  <p className="text-sm font-semibold text-white">Campus-Wide Risk Posture</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-cyan-300" />
                </div>
              </div>

              <div className="relative rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-600/10 border border-cyan-400/20 p-5 mb-4">
                <p className="text-[11px] text-slate-400 font-mono">RISK SCORE</p>
                <p className="text-3xl font-bold text-white mt-1 font-mono">24 / 100</p>
                <div className="w-full h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
                  <div className="h-full w-[24%] rounded-full bg-emerald-400 shadow-[0_0_8px_0_rgba(16,185,129,0.6)]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-lg bg-red-500/10 border border-red-400/20 p-3 text-center">
                  <p className="text-lg font-bold text-red-300 font-mono">3</p>
                  <p className="text-[10px] text-red-400/80 mt-0.5">Threats</p>
                </div>
                <div className="rounded-lg bg-amber-500/10 border border-amber-400/20 p-3 text-center">
                  <p className="text-lg font-bold text-amber-300 font-mono">8</p>
                  <p className="text-[10px] text-amber-400/80 mt-0.5">Warnings</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-400/20 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-300 font-mono">17</p>
                  <p className="text-[10px] text-emerald-400/80 mt-0.5">Resolved</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#050b18] border border-white/[0.06] p-3 font-mono text-[10.5px] space-y-1.5">
                {LIVE_EVENTS.slice(0, 3).map((evt) => (
                  <div key={evt.label} className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${EVENT_LEVEL_STYLES[evt.level].dot}`} />
                    <span className="text-slate-500">{evt.time}</span>
                    <span className={EVENT_LEVEL_STYLES[evt.level].text}>{evt.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -left-8 top-6 hidden lg:flex items-center gap-2 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl px-4 py-3"
              style={{ animation: "sg-float1 6s ease-in-out infinite" }}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">128,460 events</p>
                <p className="text-[10px] text-slate-500">processed today</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -right-6 -bottom-6 hidden lg:flex items-center gap-2 bg-[#0B1120] border border-white/10 rounded-xl shadow-xl px-4 py-3"
              style={{ animation: "sg-float2 7s ease-in-out infinite" }}
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Live Analytics</p>
                <p className="text-[10px] text-slate-500">Updated in real time</p>
              </div>
            </motion.div>

            <style>{`
              @keyframes sg-float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
              @keyframes sg-float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
            `}</style>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={() => scrollToId("overview")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-slate-500 hover:text-cyan-300 transition-colors z-10"
        >
          <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </motion.button>
      </section>

      {/* ================= SECTION 2 — LIVE SECURITY OVERVIEW ================= */}
      <section id="overview" className="py-24 sm:py-28 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="max-w-2xl mb-14">
            <SectionEyebrow>Command Center Pulse</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Live Security Overview</h2>
            <p className="text-slate-500 mt-3">A real-time read on what's happening across your campus, right now.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {LIVE_METRICS.map((metric) => {
              const Icon = metric.icon;
              const accent = ACCENT_MAP[metric.accent];
              return (
                <motion.div
                  key={metric.key}
                  variants={fadeUp}
                  className={`relative rounded-2xl border ${accent.ring} bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 40px -14px ${accent.glow}`)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0px 0 transparent")}
                >
                  <div className={`w-11 h-11 rounded-xl ${accent.bg} border ${accent.ring} flex items-center justify-center mb-5`}>
                    <Icon className={`w-5 h-5 ${accent.text}`} strokeWidth={2} />
                  </div>
                  <p className="text-xs font-medium text-slate-500 tracking-wide">{metric.label}</p>
                  <p className={`text-3xl font-bold mt-1.5 font-mono ${accent.text}`}>
                    <AnimatedCounter target={metric.value} suffix={metric.suffix} />
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 3 — PLATFORM CAPABILITIES ================= */}
      <section id="capabilities" className="py-24 sm:py-28 border-t border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="max-w-2xl mb-14">
            <SectionEyebrow>Full-Spectrum Coverage</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Platform Capabilities</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {CAPABILITIES.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 40px -16px rgba(34,211,238,0.45)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0px 0 transparent")}
                >
                  <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 group-hover:bg-cyan-400/20 flex items-center justify-center mb-5 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-cyan-300" strokeWidth={2.25} />
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-sm">{feature.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 4 — HOW THE SYSTEM WORKS ================= */}
      <section id="workflow" className="py-24 sm:py-28 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="max-w-2xl mb-16">
            <SectionEyebrow>Signal To Response</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">How The System Works</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 relative"
          >
            {WORKFLOW_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === WORKFLOW_STEPS.length - 1;
              return (
                <motion.div key={step.title} variants={fadeUp} className="relative">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 h-full transition-all duration-300 hover:border-cyan-400/30 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-11 h-11 shrink-0 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-cyan-300" strokeWidth={2.25} />
                      </div>
                      <p className="text-[11px] font-semibold text-cyan-400/70 font-mono">STEP {index + 1}</p>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1.5">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                  {!isLast && (
                    <div className="hidden xl:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 items-center justify-center w-6 h-6 rounded-full bg-[#020817] border border-cyan-400/30">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 5 — LIVE EVENT STREAM PREVIEW ================= */}
      <section id="event-stream" className="py-24 sm:py-28 border-t border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="max-w-2xl mb-10">
            <SectionEyebrow>Terminal View</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Live Event Stream</h2>
            <p className="text-slate-500 mt-3">Every signal, the instant it happens — this is what your SOC analysts see.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            onViewportEnter={() => setVisibleEvents((v) => (v === 0 ? 1 : v))}
            className="relative rounded-2xl bg-[#050b18] border border-white/[0.08] overflow-hidden"
          >
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold tracking-[0.15em] text-cyan-300 font-mono">
                  LIVE EVENT STREAM · CAMPUS NETWORK
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/70" />
                <span className="w-2 h-2 rounded-full bg-amber-500/70" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
              </div>
              <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
                initial={{ top: "0%" }}
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="px-5 py-5 font-mono text-[12.5px] space-y-2.5 min-h-[220px]">
              <AnimatePresence>
                {LIVE_EVENTS.slice(0, visibleEvents).map((evt) => {
                  const style = EVENT_LEVEL_STYLES[evt.level];
                  return (
                    <motion.div
                      key={evt.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-2.5"
                    >
                      <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                      <span className="text-slate-600">{evt.time}</span>
                      <span className={`${style.text} font-semibold`}>{evt.label}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {visibleEvents >= LIVE_EVENTS.length && (
                <div className="flex items-center gap-2 text-slate-600 pt-1">
                  <span className="w-1.5 h-2.5 bg-cyan-400/60 animate-pulse" />
                  awaiting next event…
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 6 — UNIVERSITY SECURITY COVERAGE ================= */}
      <section id="coverage" className="py-24 sm:py-28 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="max-w-2xl mb-14">
            <SectionEyebrow>Infrastructure Map</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">University Security Coverage</h2>
            <p className="text-slate-500 mt-3">Every critical system, connected to one monitoring fabric.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-8 sm:p-12"
          >
            <GridOverlay className="opacity-[0.04]" />
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mb-10 shadow-[0_0_30px_-8px_rgba(34,211,238,0.6)]">
                <Network className="w-7 h-7 text-cyan-300" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 w-full">
                {COVERAGE_NODES.map((node) => {
                  const Icon = node.icon;
                  return (
                    <motion.div
                      key={node.label}
                      variants={fadeUp}
                      className="relative flex flex-col items-center text-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-5 transition-all duration-300 hover:border-cyan-400/30 hover:-translate-y-1"
                    >
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(16,185,129,0.6)]" />
                      <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-cyan-300" />
                      </div>
                      <p className="text-xs font-medium text-slate-300 leading-tight">{node.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 7 — AI RISK ANALYTICS ================= */}
      <section className="py-24 sm:py-28 border-t border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="max-w-2xl mb-14">
            <SectionEyebrow>Behind The Score</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">AI Risk Analytics</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-1 xl:grid-cols-3 gap-5"
          >
            {/* Risk trend */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Risk Trend Distribution</h3>
              </div>
              <div className="space-y-4">
                {RISK_TRENDS.map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium" style={{ color: r.color }}>{r.label}</span>
                      <span className="text-slate-500 font-mono">{r.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${r.pct}%`, backgroundColor: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Threat categories */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold text-white">Threat Categories</h3>
              </div>
              <div className="space-y-3">
                {THREAT_CATEGORIES.map((cat) => (
                  <div key={cat.label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 flex-1">{cat.label}</span>
                    <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-400" style={{ width: `${cat.value}%` }} />
                    </div>
                    <span className="text-xs font-mono text-slate-500 w-7 text-right">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Behavioral anomalies + posture score */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <Cpu className="w-4 h-4 text-indigo-300" />
                <h3 className="text-sm font-semibold text-white">Behavioral Anomalies</h3>
              </div>
              <ul className="space-y-2.5 mb-6">
                {ANOMALIES.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    {a}
                  </li>
                ))}
              </ul>
              <div className="mt-auto rounded-xl bg-cyan-400/[0.06] border border-cyan-400/20 p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500 font-mono">POSTURE SCORE</p>
                  <p className="text-2xl font-bold text-cyan-300 font-mono mt-0.5">76 / 100</p>
                </div>
                <TrendingUp className="w-6 h-6 text-cyan-300" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 8 — FINAL CTA ================= */}
      <section className="relative py-24 sm:py-28 border-t border-white/[0.06] overflow-hidden">
        <GridOverlay className="opacity-[0.06]" />
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
            Secure Every Digital Asset Across Your Campus
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-9 max-w-xl mx-auto">
            From the student portal to the finance database — one command center, watching
            everything, all the time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-cyan-400 text-[#020817] text-sm font-semibold px-6 py-3.5 rounded-xl shadow-[0_0_28px_-6px_rgba(34,211,238,0.7)] transition-all duration-300 hover:bg-cyan-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              Open Security Center
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-sm font-semibold px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              Start Monitoring
            </button>
          </div>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0B1120] border-t border-white/[0.06] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5 text-cyan-300" />
              </div>
              <span className="font-semibold text-lg text-white">
                Command<span className="text-cyan-400">Center</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              AI-enabled cybersecurity monitoring and compliance command center for educational
              institutions.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-600 mb-4 font-mono">Quick Links</p>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button onClick={() => scrollToId(link.id)} className="hover:text-cyan-300 transition-colors duration-200">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-slate-600 mb-4 font-mono">Contact</p>
            <a href="mailto:team@commandcenter.com" className="flex items-center gap-2 text-sm hover:text-cyan-300 transition-colors duration-200 mb-4">
              <Mail className="w-4 h-4" />
              team@commandcenter.com
            </a>
            <a href="#" className="flex items-center gap-2 text-sm hover:text-cyan-300 transition-colors duration-200">
              <Globe2 className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>

        <div className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} CommandCenter. All rights reserved.</p>
            <p className="font-mono">University Security Operations Center</p>
          </div>
        </div>
      </footer>
    </div>
  );
}