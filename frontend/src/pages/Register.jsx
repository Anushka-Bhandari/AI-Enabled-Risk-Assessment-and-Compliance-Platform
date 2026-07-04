import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import securityImage from "../assets/university-security.png";


export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [universityId, setUniversityId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await registerUser({
                name,
                email,
                password,
                university_id: universityId
            });

            console.log(response.data);

            localStorage.setItem("email", email);
            navigate("/verify-otp");

        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong.");
            }
        }
    };

    return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-8">

        <div className="w-full max-w-screen-2xl min-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] grid lg:grid-cols-[45%_55%]">

            {/* LEFT PANEL */}
            <div className="bg-linear-to-br from-[#002B6B] via-[#01255D] to-[#001A45] text-white p-14 flex flex-col justify-between">

                <div>
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

                    <div className="mt-20">

                        <h1 className="text-6xl font-bold leading-tight">
                            Build.
                            <br />
                            Secure.
                            <br />
                            Comply.
                        </h1>

                        <p className="mt-8 text-xl text-blue-100 leading-relaxed max-w-xl">
                            Join your university's cybersecurity and
                            compliance platform and start assessing
                            risks with confidence.
                        </p>

                    </div>
                </div>

                {/* IMAGE */}
                <div className="flex justify-center my-10">

                    <img
                        src={securityImage}
                        alt="University Security"
                        className="w-full max-w-md object-contain"
                    />

                </div>

                {/* FEATURES */}
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
                            Compliance
                        </p>
                    </div>

                    <div>
                        <div className="text-3xl mb-2">📊</div>
                        <p className="font-medium">
                            Insights
                        </p>
                    </div>

                </div>

            </div>

            {/* RIGHT PANEL */}
            <div className="bg-slate-50 flex items-center justify-center p-12">

                <div className="w-full max-w-xl bg-white rounded-3xl p-12 shadow-lg">

                    <h1 className="text-5xl font-bold text-center text-slate-900">
                        Create Account
                    </h1>

                    <p className="text-center text-slate-500 text-lg mt-4">
                        Register to continue
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-10 space-y-6"
                    >

                        {/* Name */}
                        <div>

                            <label className="block text-slate-700 font-semibold mb-3">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                className="w-full h-14 px-5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                        </div>

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
                                className="w-full h-14 px-5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                required
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
                                placeholder="Create password"
                                className="w-full h-14 px-5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                        </div>

                        {/* University */}
                        <div>

                            <label className="block text-slate-700 font-semibold mb-3">
                                University
                            </label>

                            <select
                                value={universityId}
                                onChange={(e) =>
                                    setUniversityId(e.target.value)
                                }
                                className="w-full h-14 px-5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">
                                    Select University
                                </option>

                                <option value="1">
                                    Malaviya National Institute of Technology Jaipur
                                </option>

                                <option value="2">
                                    IIT Delhi
                                </option>

                                <option value="3">
                                    IIT Bombay
                                </option>

                            </select>

                        </div>

                        <button
                            type="submit"
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition"
                        >
                            Create Account
                        </button>

                        <p className="text-center text-slate-500">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="text-blue-600 font-semibold"
                            >
                                Sign In
                            </Link>

                        </p>

                    </form>

                </div>

            </div>

        </div>

    </div>
);
}