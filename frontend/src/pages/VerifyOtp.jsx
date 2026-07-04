import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const verifyOtp = async () => {
        try {
            const res = await axios.post("http://localhost:5000/verify-otp", {
                email,
                otp,
            });

            localStorage.setItem("token", res.data.token);

            alert(res.data.message || "Email verified successfully");
            navigate("/dashboard");

        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.error || "OTP verification failed");
        }
    };

    const resendOtp = async () => {
        try {
            await axios.post("http://localhost:5000/resend-otp", {
                email,
            });

            alert("OTP resent");
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.error || "Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
            <div className="bg-slate-900 p-8 rounded-xl w-96">

                <h2 className="text-xl font-bold mb-4">
                    Verify OTP
                </h2>

                <input
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 rounded bg-slate-800 mb-4"
                />

                <button
                    onClick={verifyOtp}
                    disabled={loading}
                    className="w-full bg-blue-600 p-3 rounded mb-2"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                <button
                    onClick={resendOtp}
                    className="w-full bg-gray-600 p-3 rounded"
                >
                    Resend OTP
                </button>
            </div>
        </div>
    );
}