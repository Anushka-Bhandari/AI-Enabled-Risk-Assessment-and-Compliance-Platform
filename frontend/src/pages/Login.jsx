import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

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

            if (
                error.response &&
                error.response.status === 404
            ) {
                alert(
                    "Account not found. Please register."
                );

                navigate("/register");
            } else if (
                error.response &&
                error.response.status === 401
            ) {
                alert("Incorrect password.");
            } else if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Server error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800">

                <h1 className="text-3xl font-bold text-white text-center">
                    Welcome Back
                </h1>

                <p className="text-slate-400 text-center mt-2">
                    Login to your account
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-4"
                >

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-slate-300 mb-2"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter email"
                            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-slate-300 mb-2"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter password"
                            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                    >
                        Login
                    </button>

                    <p className="text-center text-slate-400 mt-4">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-400 hover:text-blue-300"
                        >
                            Register
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}