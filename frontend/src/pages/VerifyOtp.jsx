import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, Loader2, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const OTP_LENGTH = 6;
const RESEND_WINDOW_SECONDS = 60;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Explicit navigation payload consumption — avoids undefined lifecycle crashes
  const email = location.state?.email || "";

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_WINDOW_SECONDS);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      // No email in navigation state — send the user back to register
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formattedTime = `00:${secondsLeft.toString().padStart(2, "0")}`;

  const handleDigitChange = (index, value) => {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    setError("");

    if (clean && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted
      .slice(0, OTP_LENGTH)
      .split("")
      .forEach((char, i) => {
        next[i] = char;
      });
    setDigits(next);
    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  const otpValue = digits.join("");
  const isComplete = otpValue.length === OTP_LENGTH;

  const handleVerify = useCallback(
    async (e) => {
      e?.preventDefault();
      if (!isComplete || isVerifying) return;

      setIsVerifying(true);
      setError("");

      try {
        await axios.post(
          `${API_BASE_URL}/verify-otp`,
          { email, otp: otpValue },
          { headers: { "Content-Type": "application/json" } }
        );

        navigate("/login", { state: { email, verified: true } });
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Invalid or expired code. Please try again.";
        setError(message);
        setDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } finally {
        setIsVerifying(false);
      }
    },
    [email, otpValue, isComplete, isVerifying, navigate]
  );

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return;
    setIsResending(true);
    setError("");

    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/resend-otp`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setSecondsLeft(RESEND_WINDOW_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to resend code right now.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 relative flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Ambient grid + glow backdrop */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-3xl shadow-2xl px-8 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="w-7 h-7 text-emerald-400" strokeWidth={2.25} />
            </div>
            <h1 className="text-xl font-bold text-white">
              Two-factor verification
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xs">
              Enter the 6-digit authorization code sent to{" "}
              <span className="text-slate-200 font-medium">{email || "your email"}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div
              className="flex items-center justify-center gap-2.5 sm:gap-3 mb-8"
              onPaste={handlePaste}
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-11 h-14 sm:w-12 sm:h-16 text-center font-mono text-3xl tracking-widest rounded-2xl bg-slate-800/80 border text-white outline-none transition-all duration-300 focus:ring-2 focus:ring-emerald-400/70 focus:border-transparent focus:bg-slate-800 focus:shadow-[0_0_20px_rgba(16,185,129,0.35)] ${
                    digit
                      ? "border-emerald-500/60 shadow-[0_0_14px_rgba(16,185,129,0.2)]"
                      : "border-slate-700"
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isComplete || isVerifying}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:bg-emerald-400 hover:scale-[1.01] hover:shadow-emerald-500/30 hover:shadow-xl active:scale-[0.99] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </form>

          <div className="flex items-center justify-between mt-7">
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            <button
              onClick={handleResend}
              disabled={secondsLeft > 0 || isResending}
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              {secondsLeft > 0 ? `Resend in ${formattedTime}` : "Resend code"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          This code expires automatically for your institution's security.
        </p>
      </div>
    </div>
  );
}