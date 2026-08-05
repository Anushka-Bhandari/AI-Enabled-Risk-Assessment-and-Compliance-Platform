import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Radar,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
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

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const response = await axios.post(`${API_BASE_URL}/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("token", response.data.token);
      navigate("/SecurityCommandCenter");
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
    <div className="min-h-screen w-full flex bg-[#020817] text-slate-200 font-sans antialiased">
      {/* LEFT: Brand / illustration panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0B1120] overflow-hidden border-r border-white/[0.06]">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
              <span className="absolute inset-0 rounded-2xl border border-cyan-400/40 animate-ping opacity-40" />
              <ShieldCheck className="w-6 h-6 text-cyan-300" strokeWidth={2.25} />
            </div>
            <div>
              <span className="font-semibold tracking-wide text-lg text-white">CommandCenter</span>
              <p className="text-[10px] uppercase tracking-[0.15em] text-cyan-400/70 font-mono">
                Univ. Security Ops
              </p>
            </div>
          </div>

          {/* Custom radar/shield illustration — no external image dependency */}
          <div className="flex-1 flex items-center justify-center py-10">
            <RadarShieldIllustration />
          </div>

          <div className="max-w-md">
            <p className="uppercase tracking-[0.2em] text-xs font-semibold text-cyan-400/80 font-mono mb-4">
              Institutional Assurance Platform
            </p>
            <h1 className="text-3xl font-bold leading-tight mb-4 text-white">
              Welcome back. Your governance posture is exactly where you left it.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Sign in to review assessment activity, monitor institutional risk, and keep
              every campus tenant audit-ready.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mt-8">
            {[
              { label: "Tenants Secured", value: "480+" },
              { label: "Controls Mapped", value: "12.4K" },
              { label: "Uptime SLA", value: "99.98%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 backdrop-blur-xl"
              >
                <p className="font-mono text-lg font-semibold text-cyan-300">{stat.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
            </div>
            <span className="font-semibold text-lg text-white">CommandCenter</span>
          </div>

          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
              <p className="text-sm text-slate-400 mt-2">
                Enter your institutional credentials to access your governance workspace.
              </p>
            </div>

            {serverError && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@institution.edu"
                    autoComplete="email"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white/[0.02] text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 ${
                      errors.email ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-white/[0.02] text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 ${
                      errors.password ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 font-semibold py-3.5 rounded-xl transition-all duration-300 hover:bg-cyan-400/20 hover:shadow-[0_0_30px_-8px_rgba(34,211,238,0.5)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
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

            <p className="text-center text-sm text-slate-400 mt-7">
              New to CommandCenter?{" "}
              <button
                onClick={() => navigate("/register")}
                className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              >
                Register your institution
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Protected by end-to-end encryption &amp; SOC 2 aligned controls.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * RadarShieldIllustration
 *
 * Custom-built graphic (no external image) — concentric radar rings
 * sweeping behind a central shield, with a few pulsing "event" nodes.
 * Mirrors the cyan/glow language used across the dashboard so the login
 * screen reads as the front door of the same product, not a generic
 * marketing page.
 */
function RadarShieldIllustration() {
  const nodes = [
    { x: 60, angle: 20, delay: 0 },
    { x: 95, angle: 160, delay: 0.6 },
    { x: 80, angle: 260, delay: 1.2 },
    { x: 110, angle: 320, delay: 1.8 },
  ];

  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      {/* radar rings, slow sweep */}
      {[140, 110, 80].map((r, i) => (
        <div
          key={r}
          className="absolute rounded-full border border-cyan-400/20"
          style={{ width: r * 2, height: r * 2 }}
        />
      ))}

      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(34,211,238,0.35), transparent 35%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {/* event nodes pulsing at fixed radar positions */}
      {nodes.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = Math.cos(rad) * node.x;
        const y = Math.sin(rad) * node.x;
        return (
          <motion.span
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.7)]"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: node.delay }}
          />
        );
      })}

      {/* central shield */}
      <div className="relative z-10 w-24 h-24 rounded-3xl bg-[#0B1120] border border-cyan-400/30 flex items-center justify-center shadow-[0_0_50px_-10px_rgba(34,211,238,0.4)]">
        <Radar className="w-10 h-10 text-cyan-300" strokeWidth={1.75} />
      </div>
    </div>
  );
}