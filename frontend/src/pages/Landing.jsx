import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    ShieldCheck,
    Menu,
    X,
    ArrowRight,
    PlayCircle,
    ClipboardList,
    FileSearch,
    Scale,
    Inbox as InboxIcon,
    UserPlus,
    Mail,
    LogIn,
    ClipboardCheck,
    UploadCloud,
    Cpu,
    Gauge,
    FileDown,
    Lock,
    Sparkles,
    BarChart3,
    FileBarChart2,
    History,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    ShieldAlert,
    Zap,
    Clock,
    Layers,
    Target,
    Building2,
    Database,
    Server,
    Code2,
    KeyRound,
    BrainCircuit,
    FileText,
    Bot,
    Globe2,
    LineChart,
    CheckCircle2,
    ArrowDown,
} from "lucide-react";

const NAVY = "#0B2A66";

// ---------------------------------------------------------------------------
// Static content — kept out of the component body so it isn't re-created on
// every render, and so copy changes don't touch the layout code below.
// ---------------------------------------------------------------------------

const NAV_LINKS = [
    { label: "Features", id: "features" },
    { label: "Dashboard", id: "dashboard-showcase" },
    { label: "Technology", id: "technology" },
    { label: "Future Scope", id: "future-scope" },
];

const CHALLENGES = [
    {
        icon: ClipboardList,
        title: "Manual Compliance Reviews",
        description:
            "Committees still walk policy documents line by line, which leaves institutional risk resting on whoever happened to read closely.",
    },
    {
        icon: Clock,
        title: "Time-Consuming Audits",
        description:
            "A single accreditation cycle can take weeks to assemble, pulling faculty and administrators away from the work that actually needs them.",
    },
    {
        icon: Scale,
        title: "Inconsistent Assessments",
        description:
            "Without a shared framework, two departments scoring the same risk can land on two very different answers.",
    },
    {
        icon: InboxIcon,
        title: "Lack of Centralized Reporting",
        description:
            "Findings live in scattered spreadsheets and email threads, so leadership never sees one clear picture of institutional posture.",
    },
];

const WORKFLOW_STEPS = [
    { icon: UserPlus, title: "Register Institution", description: "Create your institution's workspace in a few minutes." },
    { icon: Mail, title: "Email OTP Verification", description: "Confirm ownership with a one-time code sent to your inbox." },
    { icon: LogIn, title: "Login", description: "Access your workspace with JWT-secured authentication." },
    { icon: ClipboardCheck, title: "Complete Assessment", description: "Work through structured, governance-focused questionnaires." },
    { icon: UploadCloud, title: "Upload Policies", description: "Attach the policy documents your assessment references." },
    { icon: Cpu, title: "AI Risk Analysis", description: "Groq-powered analysis reads your responses and documents together." },
    { icon: Gauge, title: "Compliance Score Generation", description: "Get a single, defensible score for your institution's posture." },
    { icon: FileDown, title: "Download PDF Report", description: "Export a shareable report for your governance records." },
];

const FEATURES = [
    { icon: Lock, title: "Secure OTP Authentication", description: "Every account is verified by email OTP before it can touch institutional data." },
    { icon: ClipboardList, title: "Questionnaire-Based Assessment", description: "Structured, governance-specific questions replace ad-hoc review checklists." },
    { icon: FileSearch, title: "Policy Upload Analysis", description: "Upload existing policy documents for direct analysis against your responses." },
    { icon: Sparkles, title: "AI Risk Detection", description: "Groq LLM surfaces governance gaps a manual read is likely to miss." },
    { icon: Gauge, title: "Compliance Scoring", description: "A single, consistent score makes posture easy to track and compare." },
    { icon: BarChart3, title: "Dashboard Analytics", description: "Institution-wide visibility into risk, activity, and trends in one place." },
    { icon: FileBarChart2, title: "PDF Report Generation", description: "Export audit-ready reports whenever leadership or accreditors need them." },
    { icon: History, title: "Assessment History Tracking", description: "Every submission is retained, so progress over time is never lost." },
];

const BENEFITS = [
    "Faster Compliance Reviews",
    "Reduced Manual Effort",
    "Better Governance Decisions",
    "Centralized Assessment Records",
    "Improved Regulatory Readiness",
    "Data-Driven Risk Monitoring",
];

const TECH_STACK = [
    { icon: Code2, category: "Frontend", items: ["React", "Tailwind CSS"] },
    { icon: Server, category: "Backend", items: ["Flask", "Python"] },
    { icon: Database, category: "Database", items: ["MySQL"] },
    { icon: KeyRound, category: "Authentication", items: ["JWT", "Email OTP"] },
    { icon: BrainCircuit, category: "AI Layer", items: ["Groq LLM"] },
    { icon: FileText, category: "Reporting", items: ["PDF Generation"] },
];

const FUTURE_SCOPE = [
    { icon: Bot, title: "Automated Policy Intelligence", description: "Deeper document understanding that flags clauses needing attention on its own." },
    { icon: Building2, title: "UGC/AICTE Institution Directory", description: "A verified directory so institutions register against recognized records." },
    { icon: Target, title: "Institution Benchmarking", description: "Compare compliance posture against peer institutions, anonymized and aggregated." },
    { icon: LineChart, title: "Advanced Risk Analytics", description: "Predictive trend analysis that flags emerging risk before it becomes a finding." },
    { icon: Globe2, title: "Cloud Deployment", description: "Multi-region hosting for institutions with data-residency requirements." },
    { icon: Sparkles, title: "AI Compliance Recommendations", description: "Suggested remediation steps generated directly from assessment results." },
];

const DASHBOARD_ANALYTICS = [
    { label: "Compliance Score", value: "92%", icon: Gauge, accent: "from-emerald-600 to-teal-600" },
    { label: "High Risks", value: "3", icon: AlertTriangle, accent: "from-red-600 to-rose-600" },
    { label: "Medium Risks", value: "8", icon: ShieldAlert, accent: "from-amber-500 to-orange-600" },
    { label: "Low Risks", value: "17", icon: ShieldCheck, accent: "from-slate-700 to-slate-900" },
];

const RECENT_ASSESSMENTS = [
    { id: 104, institution: "University #2", date: "Jul 12, 2026", risk: "Low" },
    { id: 103, institution: "University #4", date: "Jul 9, 2026", risk: "Medium" },
    { id: 102, institution: "University #1", date: "Jul 5, 2026", risk: "High" },
    { id: 101, institution: "University #3", date: "Jun 28, 2026", risk: "Low" },
];

const RISK_BADGE = {
    High: "text-red-700 bg-red-50 border-red-200",
    Medium: "text-amber-700 bg-amber-50 border-amber-200",
    Low: "text-emerald-700 bg-emerald-50 border-emerald-200",
};

function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
};

function GridOverlay({ className = "" }) {
    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{
                backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
            }}
        />
    );
}

function SectionEyebrow({ children }) {
    return (
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-blue-600 mb-3">
            {children}
        </p>
    );
}

export default function Landing() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroFade = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
    const heroShift = useTransform(scrollYProgress, [0, 1], [0, 40]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleNavClick = (id) => {
        setMobileOpen(false);
        scrollToId(id);
    };

    return (
        <div className="min-h-screen w-full bg-white text-slate-900 overflow-x-hidden">
            {/* ---------------------------------------------------------- */}
            {/* SECTION 1 — NAVBAR                                          */}
            {/* ---------------------------------------------------------- */}
            <header
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? "bg-white/85 backdrop-blur-md border-b border-slate-200/70 shadow-sm"
                        : "bg-transparent border-b border-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 py-3 flex items-center justify-between">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="flex items-center gap-2.5"
                    >
                        <div className="w-9 h-9 rounded-xl bg-[#0B2A66] flex items-center justify-center shadow-md shadow-blue-900/20">
                            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" strokeWidth={2.25} />
                        </div>
                        <span className="font-semibold tracking-wide text-lg text-slate-900">
                            Sentinel<span className="text-[#0B2A66]">Grid</span>
                        </span>
                    </button>

                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavClick(link.id)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-[#0B2A66] hover:bg-slate-50 transition-all duration-200"
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center gap-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#0B2A66] hover:bg-slate-50 transition-all duration-200"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-1.5 bg-[#0B2A66] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-900/20 transition-all duration-300 hover:bg-slate-900 hover:scale-[1.03] active:scale-[0.98]"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        className="lg:hidden text-slate-700"
                        onClick={() => setMobileOpen((v) => !v)}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1"
                    >
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavClick(link.id)}
                                className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                {link.label}
                            </button>
                        ))}
                        <div className="pt-3 flex flex-col gap-2">
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-[#0B2A66] border border-slate-200"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full text-center bg-[#0B2A66] text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
                            >
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                )}
            </header>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 2 — HERO                                            */}
            {/* ---------------------------------------------------------- */}
            <section
                ref={heroRef}
                className="relative bg-[#0B2A66] text-white pt-36 pb-28 sm:pt-44 sm:pb-36 overflow-hidden"
            >
                <GridOverlay className="opacity-[0.06]" />
                <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-16 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

                <motion.div
                    style={{ opacity: heroFade, y: heroShift }}
                    className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                >
                    <motion.div initial="hidden" animate="show" variants={staggerContainer}>
                        <motion.p variants={fadeUp} className="uppercase tracking-[0.2em] text-xs font-semibold text-blue-200/80 mb-5">
                            AI-Enabled Risk Assessment &amp; Compliance Platform
                        </motion.p>
                        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.08] mb-6">
                            AI-Powered Compliance &amp; Risk Assessment for Educational Institutions
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-blue-100/80 text-base sm:text-lg leading-relaxed max-w-xl mb-9">
                            Evaluate institutional compliance, identify governance risks, and generate
                            actionable reports through intelligent assessments and policy analysis.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="flex items-center gap-2 bg-white text-[#0B2A66] text-sm font-semibold px-6 py-3.5 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => scrollToId("dashboard-showcase")}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-semibold px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                            >
                                <PlayCircle className="w-4.5 h-4.5 text-emerald-400" />
                                View Demo
                            </button>
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex items-center gap-6 mt-10 text-blue-100/70 text-xs">
                            <span className="flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-emerald-400" /> JWT + OTP secured
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Groq LLM analysis
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Floating dashboard illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative hidden sm:block"
                    >
                        <div className="relative rounded-3xl bg-white text-slate-900 shadow-2xl p-6 max-w-md mx-auto">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-xs text-slate-400">Institution Overview</p>
                                    <p className="text-sm font-semibold text-slate-900">Coastal State University</p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-[#0B2A66] flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                </div>
                            </div>

                            <div className="rounded-2xl bg-gradient-to-br from-[#0B2A66] to-blue-700 text-white p-5 mb-4">
                                <p className="text-xs text-blue-100/80">Compliance Score</p>
                                <p className="text-3xl font-bold mt-1">92%</p>
                                <div className="w-full h-1.5 rounded-full bg-white/20 mt-3 overflow-hidden">
                                    <div className="h-full w-[92%] rounded-full bg-emerald-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-center">
                                    <p className="text-lg font-bold text-red-600">3</p>
                                    <p className="text-[10px] text-red-500 mt-0.5">High Risks</p>
                                </div>
                                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-center">
                                    <p className="text-lg font-bold text-amber-600">8</p>
                                    <p className="text-[10px] text-amber-500 mt-0.5">Medium Risks</p>
                                </div>
                                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                                    <p className="text-lg font-bold text-emerald-600">17</p>
                                    <p className="text-[10px] text-emerald-500 mt-0.5">Low Risks</p>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="absolute -left-8 top-8 hidden lg:flex items-center gap-2 bg-white rounded-2xl shadow-xl px-4 py-3"
                            style={{ animation: "float1 6s ease-in-out infinite" }}
                        >
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <FileDown className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-900">Report Generated</p>
                                <p className="text-[10px] text-slate-400">PDF ready to download</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="absolute -right-6 -bottom-6 hidden lg:flex items-center gap-2 bg-white rounded-2xl shadow-xl px-4 py-3"
                            style={{ animation: "float2 7s ease-in-out infinite" }}
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-[#0B2A66]" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-900">Institution Analytics</p>
                                <p className="text-[10px] text-slate-400">Updated in real time</p>
                            </div>
                        </motion.div>

                        <style>{`
                            @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                            @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
                        `}</style>
                    </motion.div>
                </motion.div>

                <motion.button
                    onClick={() => scrollToId("problem")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-blue-200/60 hover:text-white transition-colors z-10"
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                </motion.button>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 3 — PROBLEM                                         */}
            {/* ---------------------------------------------------------- */}
            <section id="problem" className="py-24 sm:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        className="max-w-2xl mb-14"
                    >
                        <SectionEyebrow>Where things break down</SectionEyebrow>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">The Challenge</h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
                    >
                        {CHALLENGES.map((item) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.title}
                                    variants={fadeUp}
                                    className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B2A66] to-blue-700 flex items-center justify-center shadow-md mb-5">
                                        <Icon className="w-5 h-5 text-white" strokeWidth={2.25} />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 4 — SOLUTION / WORKFLOW                             */}
            {/* ---------------------------------------------------------- */}
            <section className="py-24 sm:py-32 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        className="max-w-2xl mb-16"
                    >
                        <SectionEyebrow>An intentional workflow</SectionEyebrow>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How SentinelGrid Works</h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={staggerContainer}
                        className="relative"
                    >
                        <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-200 hidden sm:block" />
                        <div className="space-y-4">
                            {WORKFLOW_STEPS.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div
                                        key={step.title}
                                        variants={fadeUp}
                                        className="relative flex items-center gap-5 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 sm:ml-0"
                                    >
                                        <div className="relative z-10 w-12 h-12 shrink-0 rounded-xl bg-[#0B2A66] flex items-center justify-center shadow-md shadow-blue-900/20">
                                            <Icon className="w-5 h-5 text-emerald-400" strokeWidth={2.25} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-blue-600 mb-0.5">
                                                Step {index + 1}
                                            </p>
                                            <h3 className="font-semibold text-slate-900">{step.title}</h3>
                                            <p className="text-sm text-slate-500 mt-0.5">{step.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 5 — FEATURES                                        */}
            {/* ---------------------------------------------------------- */}
            <section id="features" className="py-24 sm:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        className="max-w-2xl mb-14"
                    >
                        <SectionEyebrow>Everything you need</SectionEyebrow>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            Built for institutional governance
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
                    >
                        {FEATURES.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    variants={fadeUp}
                                    className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-[#0B2A66] flex items-center justify-center transition-colors duration-300 mb-5">
                                        <Icon className="w-5 h-5 text-[#0B2A66] group-hover:text-emerald-400 transition-colors duration-300" strokeWidth={2.25} />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-2 text-sm">{feature.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 6 — DASHBOARD SHOWCASE                              */}
            {/* ---------------------------------------------------------- */}
            <section id="dashboard-showcase" className="py-24 sm:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        className="max-w-2xl mb-14"
                    >
                        <SectionEyebrow>See it in action</SectionEyebrow>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            Institution Compliance Dashboard
                        </h2>
                        <p className="text-slate-500 mt-3">
                            A live view of assessment activity, risk distribution, and compliance
                            posture — all in one workspace.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.7 }}
                        className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4 sm:p-8 shadow-xl"
                    >
                        {/* Analytics cards */}
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                            {DASHBOARD_ANALYTICS.map((card) => {
                                const Icon = card.icon;
                                return (
                                    <div key={card.label} className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm">
                                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.accent} flex items-center justify-center mb-4`}>
                                            <Icon className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-xs text-slate-500">{card.label}</p>
                                        <p className="text-xl font-bold text-slate-900 mt-1">{card.value}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                            {/* Risk distribution */}
                            <div className="rounded-2xl bg-white border border-slate-200/70 p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-slate-900 mb-5">Risk Distribution</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "High", pct: 11, color: "bg-red-500", text: "text-red-600" },
                                        { label: "Medium", pct: 29, color: "bg-amber-500", text: "text-amber-600" },
                                        { label: "Low", pct: 60, color: "bg-emerald-500", text: "text-emerald-600" },
                                    ].map((r) => (
                                        <div key={r.label}>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className={`font-medium ${r.text}`}>{r.label}</span>
                                                <span className="text-slate-400">{r.pct}%</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                                <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Assessment activity */}
                            <div className="rounded-2xl bg-white border border-slate-200/70 p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-slate-900 mb-5">Assessment Activity</h3>
                                <div className="flex items-end gap-2.5 h-32">
                                    {[38, 52, 44, 68, 58, 74, 92].map((h, i) => (
                                        <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-[#0B2A66] to-blue-500" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-3">Submissions — last 7 weeks</p>
                            </div>

                            {/* Recent assessments */}
                            <div className="rounded-2xl bg-white border border-slate-200/70 p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Assessments</h3>
                                <div className="space-y-3">
                                    {RECENT_ASSESSMENTS.map((a) => (
                                        <div key={a.id} className="flex items-center justify-between text-xs">
                                            <div>
                                                <p className="font-medium text-slate-800">#{a.id} · {a.institution}</p>
                                                <p className="text-slate-400">{a.date}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full border font-semibold ${RISK_BADGE[a.risk]}`}>
                                                {a.risk}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 7 — WHY IT MATTERS                                  */}
            {/* ---------------------------------------------------------- */}
            <section className="py-24 sm:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                    >
                        <SectionEyebrow>The payoff</SectionEyebrow>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">
                            Why Institutions Choose SentinelGrid
                        </h2>
                        <p className="text-slate-500 leading-relaxed max-w-lg">
                            Governance teams adopt SentinelGrid to replace fragmented, manual review
                            cycles with a single system of record for institutional risk.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {BENEFITS.map((benefit) => (
                            <motion.div
                                key={benefit}
                                variants={fadeUp}
                                className="flex items-center gap-3 rounded-xl bg-white border border-slate-200/70 px-5 py-4 shadow-sm"
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-800">{benefit}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 8 — TECHNOLOGY STACK                                */}
            {/* ---------------------------------------------------------- */}
            <section id="technology" className="py-24 sm:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        className="max-w-2xl mb-14"
                    >
                        <SectionEyebrow>Under the hood</SectionEyebrow>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Technology Stack</h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                    >
                        {TECH_STACK.map((stack) => {
                            const Icon = stack.icon;
                            return (
                                <motion.div
                                    key={stack.category}
                                    variants={fadeUp}
                                    className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2A66] to-blue-700 flex items-center justify-center shadow-md">
                                            <Icon className="w-4.5 h-4.5 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900">{stack.category}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {stack.items.map((item) => (
                                            <span
                                                key={item}
                                                className="text-xs font-medium text-[#0B2A66] bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 9 — FUTURE SCOPE                                    */}
            {/* ---------------------------------------------------------- */}
            <section id="future-scope" className="py-24 sm:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={fadeUp}
                        className="max-w-2xl mb-14"
                    >
                        <SectionEyebrow>What's next</SectionEyebrow>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Future Enhancements</h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                    >
                        {FUTURE_SCOPE.map((item) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.title}
                                    variants={fadeUp}
                                    className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 hover:border-blue-300 hover:bg-white transition-all duration-300"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5 shadow-sm">
                                        <Icon className="w-5 h-5 text-[#0B2A66]" strokeWidth={2.25} />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-2 text-sm">{item.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 10 — FINAL CTA                                      */}
            {/* ---------------------------------------------------------- */}
            <section className="relative py-24 sm:py-28 bg-[#0B2A66] overflow-hidden">
                <GridOverlay className="opacity-[0.06]" />
                <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={fadeUp}
                    className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8 text-center"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
                        Transform Institutional Compliance Management
                    </h2>
                    <p className="text-blue-100/80 text-base leading-relaxed mb-9 max-w-xl mx-auto">
                        Empower your institution with intelligent compliance assessment, risk
                        identification, and reporting.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-2 bg-white text-[#0B2A66] text-sm font-semibold px-6 py-3.5 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-semibold px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                        >
                            Register Institution
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/* SECTION 11 — FOOTER                                         */}
            {/* ---------------------------------------------------------- */}
            <footer className="bg-slate-950 text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                            </div>
                            <span className="font-semibold text-lg text-white">
                                Sentinel<span className="text-emerald-400">Grid</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs">
                            AI-enabled risk assessment and compliance platform for educational
                            institutions.
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">Quick Links</p>
                        <ul className="space-y-2.5 text-sm">
                            {NAV_LINKS.map((link) => (
                                <li key={link.id}>
                                    <button
                                        onClick={() => scrollToId(link.id)}
                                        className="hover:text-white transition-colors duration-200"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">Contact</p>
                        <a
                            href="mailto:team@sentinelgrid.com"
                            className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-200 mb-4"
                        >
                            <Mail className="w-4 h-4" />
                            team@sentinelgrid.com
                        </a>
                        <a
                            href="#"
                            className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-200"
                        >
                            <Globe2 className="w-4 h-4" />
                            GitHub
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                        <p>© {new Date().getFullYear()} SentinelGrid. All rights reserved.</p>
                        <p>Built for institutional governance &amp; compliance.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
