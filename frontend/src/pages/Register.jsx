import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [institute, setInstitute] = useState("");

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
                institute,
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
                alert(error.response.data.message);
            } else {
                alert("Something went wrong.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800">

                <h1 className="text-3xl font-bold text-white text-center">
                    Create Account
                </h1>

                <p className="text-slate-400 text-center mt-2">
                    Register to continue
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-4"
                >

                    <div>
                        <label
                            htmlFor="name"
                            className="block text-slate-300 mb-2"
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

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
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
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
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="institute"
                            className="block text-slate-300 mb-2"
                        >
                            Institute
                        </label>

                        <input
                            id="institute"
                            name="institute"
                            type="text"
                            value={institute}
                            onChange={(e) => setInstitute(e.target.value)}
                            placeholder="Institute"
                            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                    >
                        Register
                    </button>

                    <p className="text-center text-slate-400 mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-400 hover:text-blue-300"
                        >
                            Login
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}