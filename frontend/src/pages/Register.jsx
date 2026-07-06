import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ShieldCheck,
    Building2,
    Mail,
    Lock,
    User as UserIcon,
    ChevronDown,
    Loader2,
    AlertCircle,
    ArrowRight,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const UNIVERSITIES = [
    { id: 1, name: "Rajasthan Institute of Technology" },
    { id: 2, name: "National University of Governance" },
    { id: 3, name: "Metropolitan School of Engineering" },
    { id: 4, name: "Coastal State University" },
    { id: 5, name: "Northbridge Institute of Compliance Studies" },
];

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        university_id: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setServerError("");
    };

    const validate = () => {
        const nextErrors = {};

        if (!formData.name.trim()) {
            nextErrors.name = "Full name is required.";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "Institutional email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!formData.password) {
            nextErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters.";
        }

        if (formData.confirmPassword !== formData.password) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        if (!formData.university_id) {
            nextErrors.university_id = "Select your institution.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                // Explicitly cast university_id to Integer to satisfy the
                // SQLAlchemy ForeignKey constraint on University.id
                university_id: parseInt(formData.university_id, 10),
            };

            await axios.post(`${API_BASE_URL}/register`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            navigate("/verify-otp", { state: { email: payload.email } });
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Registration failed. Please verify your details and try again.";
            setServerError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-50">
            {/* LEFT: Institutional Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0B2A66] overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                    }}
                />
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-md h-112 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col justify-between p-14 text-white w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" strokeWidth={2.25} />
                        </div>
                        <span className="font-semibold tracking-wide text-lg">
                            Sentinel<span className="text-emerald-400">Grid</span>
                        </span>
                    </div>

                    <div className="max-w-md">
                        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-blue-200/80 mb-4">
                            Institutional Assurance Platform
                        </p>
                        <h1 className="text-4xl font-bold leading-tight mb-6">
                            Multi-tenant cybersecurity &amp; AI governance, assessed with
                            precision.
                        </h1>
                        <p className="text-blue-100/80 text-sm leading-relaxed">
                            Onboard your institution to run structured compliance
                            assessments, capture evidentiary documents, and generate
                            board-ready risk posture reports across every campus tenant.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 max-w-md">
                        {[
                            { label: "Tenants Secured", value: "480+" },
                            { label: "Controls Mapped", value: "12.4K" },
                            { label: "Uptime SLA", value: "99.98%" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
                            >
                                <p className="font-mono text-lg font-semibold text-emerald-400">
                                    {stat.value}
                                </p>
                                <p className="text-[11px] text-blue-100/70 mt-1">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Registration Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-xl bg-[#0B2A66] flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="font-semibold text-lg text-slate-900">
                            SentinelGrid
                        </span>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/70 p-8 sm:p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Create your institutional account
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Register your organization to begin governance and compliance
                                onboarding.
                            </p>
                        </div>

                        {serverError && (
                            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-crimson-200 bg-red-50 border-red-200 px-4 py-3">
                                <AlertCircle className="w-5 h-5 text-crimson-600 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{serverError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <UserIcon className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Dr. Ananya Sharma"
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50/60 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${errors.name ? "border-red-400" : "border-slate-200"
                                            }`}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Institutional Email
                                </label>
                                <div className="relative">
                                    <Mail className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@institution.edu"
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50/60 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${errors.email ? "border-red-400" : "border-slate-200"
                                            }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>
                                )}
                            </div>

                            {/* University Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Institution
                                </label>
                                <div className="relative">
                                    <Building2 className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                                    <select
                                        name="university_id"
                                        value={formData.university_id}
                                        onChange={handleChange}
                                        className={`w-full appearance-none pl-11 pr-10 py-3 rounded-xl border bg-slate-50/60 text-slate-900 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white cursor-pointer ${errors.university_id
                                                ? "border-red-400"
                                                : "border-slate-200"
                                            } ${!formData.university_id ? "text-slate-400" : ""}`}
                                    >
                                        <option value="" disabled>
                                            Select your institution
                                        </option>
                                        {UNIVERSITIES.map((uni) => (
                                            <option key={uni.id} value={uni.id} className="text-slate-900">
                                                {uni.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {errors.university_id && (
                                    <p className="text-xs text-red-600 mt-1.5">
                                        {errors.university_id}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50/60 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${errors.password ? "border-red-400" : "border-slate-200"
                                                }`}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-xs text-red-600 mt-1.5">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Confirm
                                    </label>
                                    <div className="relative">
                                        <Lock className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50/60 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${errors.confirmPassword
                                                    ? "border-red-400"
                                                    : "border-slate-200"
                                                }`}
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-xs text-red-600 mt-1.5">
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#0B2A66] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 hover:bg-slate-900 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating account…
                                    </>
                                ) : (
                                    <>
                                        Register Institution
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-7">
                            Already onboarded?{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="font-semibold text-[#0B2A66] hover:text-blue-700 transition-colors duration-200"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-6">
                        Protected by end-to-end encryption &amp; SOC 2 aligned controls.
                    </p>
                </div>
            </div>
        </div>
    );
}