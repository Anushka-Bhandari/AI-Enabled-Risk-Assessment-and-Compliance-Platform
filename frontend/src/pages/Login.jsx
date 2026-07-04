import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import securityImage from "../assets/university-security.png";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser({
                email,
                password,
            });

            console.log(response.data);

            if (response.data.token) {
                localStorage.setItem(
                    "token",
                    response.data.token
                );
            }

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            if (error.response) {

                // 👇 USER NOT VERIFIED
                if (error.response.status === 403) {
                    alert("Please verify your email first");
                    localStorage.setItem("email", email);
                    navigate("/verify-otp");
                    return;
                }

                // 👇 USER NOT FOUND
                if (error.response.status === 404) {
                    alert("Account not found. Please register.");
                    navigate("/register");
                    return;
                }

                // 👇 WRONG PASSWORD
                if (error.response.status === 401) {
                    alert("Incorrect password.");
                    return;
                }

                alert(error.response.data.message || "Error occurred");
            } else {
                alert("Server error");
            }
        }
    };

    return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-8">

        <div className="w-full max-w-screen-2xl min-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] grid lg:grid-cols-[45%_55%]">

            {/* LEFT PANEL */}
            <div className="bg-linear-to-br from-[#002B6B] via-[#01255D] to-[#001A45] text-white p-14 flex flex-col justify-between">

                <div>

                    {/* Logo */}
                    <div className="flex items-center gap-4">

                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl">
                            🛡️
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold">
                                University Risk
                            </h2>

                            <p className="text-2xl text-blue-100">
                                Assessment Platform
                            </p>
                        </div>

                    </div>

                    {/* Heading */}
                    <div className="mt-20">

                        <h1 className="text-6xl font-bold leading-tight">
                            Secure.
                            <br />
                            Compliant.
                            <br />
                            Future Ready.
                        </h1>

                        <p className="mt-8 text-xl text-blue-100 leading-relaxed max-w-xl">
                            Assess, manage and improve your university's
                            cybersecurity and data privacy compliance
                            with DPDP Act 2023.
                        </p>

                    </div>

                </div>

                {/* Illustration */}
                <div className="flex justify-center my-10">

                    <img
                        src={securityImage}
                        alt="University Security"
                        className="w-full max-w-md object-contain"
                    />

                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-6 text-center">

                    <div>
                        <div className="text-3xl mb-2">🛡️</div>
                        <p className="font-medium">
                            Risk Assessment
                        </p>
                    </div>

                    <div>
                        <div className="text-3xl mb-2">📋</div>
                        <p className="font-medium">
                            Compliance Monitoring
                        </p>
                    </div>

                    <div>
                        <div className="text-3xl mb-2">📊</div>
                        <p className="font-medium">
                            Actionable Insights
                        </p>
                    </div>

                </div>

            </div>

            {/* RIGHT PANEL */}
            <div className="bg-slate-50 flex items-center justify-center p-12">

                <div className="w-full max-w-xl bg-white rounded-3xl p-12 shadow-lg">

                    <h1 className="text-5xl font-bold text-center text-slate-900">
                        Welcome Back
                    </h1>

                    <p className="text-center text-slate-500 text-lg mt-4">
                        Sign in to your account to continue
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-10 space-y-6"
                    >

                        {/* Email */}
                        <div>

                            <label className="block text-slate-700 font-semibold mb-3">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                className="
                                    w-full
                                    h-14
                                    px-5
                                    border
                                    border-slate-300
                                    rounded-xl
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div>

                        {/* Password */}
                        <div>

                            <label className="block text-slate-700 font-semibold mb-3">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                className="
                                    w-full
                                    h-14
                                    px-5
                                    border
                                    border-slate-300
                                    rounded-xl
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex justify-between items-center">

                            <label className="flex items-center gap-2 text-slate-600">

                                <input
                                    type="checkbox"
                                    className="w-4 h-4"
                                />

                                Remember me

                            </label>

                            <button
                                type="button"
                                className="text-blue-600 font-medium"
                            >
                                Forgot Password?
                            </button>

                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="
                                w-full
                                h-14
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                rounded-xl
                                font-semibold
                                text-lg
                                transition
                            "
                        >
                            Sign In
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4">

                            <hr className="flex-1" />

                            <span className="text-slate-400">
                                OR
                            </span>

                            <hr className="flex-1" />

                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            className="
                                w-full
                                h-14
                                border
                                border-slate-300
                                rounded-xl
                                font-medium
                                bg-white
                            "
                        >
                            Sign in with Google
                        </button>

                        {/* Register */}
                        <p className="text-center text-slate-500">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="text-blue-600 font-semibold"
                            >
                                Sign up
                            </Link>

                        </p>

                    </form>

                </div>

            </div>

        </div>

    </div>
);
}