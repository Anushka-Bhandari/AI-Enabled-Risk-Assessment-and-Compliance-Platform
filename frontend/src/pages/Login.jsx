import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ShieldCheck,
    Mail,
    Lock,
    Loader2,
    AlertCircle,
    ArrowRight,
    Eye,
    EyeOff,
} from "lucide-react";

const API_BASE_URL =
    import.meta.env.VITE_API_URL;

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setServerError("");
    };

    const validate = () => {
        const nextErrors = {};

        if (!formData.email.trim()) {
            nextErrors.email = "Institutional email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!formData.password) {
            nextErrors.password = "Password is required.";
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
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            };

            const response = await axios.post(`${API_BASE_URL}/login`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Invalid email or password. Please try again.";
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
                            Welcome back. Your governance posture is exactly where you left
                            it.
                        </h1>
                        <p className="text-blue-100/80 text-sm leading-relaxed">
                            Sign in to review assessment activity, monitor institutional
                            risk, and keep every campus tenant audit-ready.
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

            {/* RIGHT: Login Form */}
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
                                Sign in to your account
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Enter your institutional credentials to access your
                                governance workspace.
                            </p>
                        </div>

                        {serverError && (
                            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{serverError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                                        autoComplete="email"
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50/60 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${
                                            errors.email ? "border-red-400" : "border-slate-200"
                                        }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/forgot-password")}
                                        className="text-xs font-semibold text-[#0B2A66] hover:text-blue-700 transition-colors duration-200"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-slate-50/60 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${
                                            errors.password ? "border-red-400" : "border-slate-200"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4.5 h-4.5" />
                                        ) : (
                                            <Eye className="w-4.5 h-4.5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-600 mt-1.5">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#0B2A66] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 hover:bg-slate-900 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-7">
                            New to SentinelGrid?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="font-semibold text-[#0B2A66] hover:text-blue-700 transition-colors duration-200"
                            >
                                Register your institution
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