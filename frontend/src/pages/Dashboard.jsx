import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold">
                    AI Risk Platform
                </h1>

                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                >
                    Logout
                </button>
            </nav>

            <div className="p-6">

                {/* Welcome Card */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                    <h2 className="text-3xl font-bold">
                        Welcome 👋
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Manage risk assessments and compliance reports.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4 mt-6">

                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                        <h3 className="text-slate-400">
                            Total Assessments
                        </h3>
                        <p className="text-3xl font-bold mt-2">
                            24
                        </p>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                        <h3 className="text-slate-400">
                            High Risks
                        </h3>
                        <p className="text-3xl font-bold mt-2">
                            5
                        </p>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                        <h3 className="text-slate-400">
                            Medium Risks
                        </h3>
                        <p className="text-3xl font-bold mt-2">
                            11
                        </p>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                        <h3 className="text-slate-400">
                            Compliance Score
                        </h3>
                        <p className="text-3xl font-bold mt-2">
                            87%
                        </p>
                    </div>

                </div>

                {/* Recent Assessments */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 mt-6 p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Recent Assessments
                    </h2>

                    <div className="space-y-3">

                        <div className="bg-slate-800 p-4 rounded-lg">
                            Student Data Privacy Risk
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg">
                            AI Usage Compliance Check
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg">
                            Network Security Review
                        </div>

                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4 mt-6">

                    <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-semibold">
                        New Assessment
                    </button>

                    <button className="bg-green-600 hover:bg-green-700 p-4 rounded-xl font-semibold">
                        Generate Report
                    </button>

                    <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded-xl font-semibold">
                        View Risks
                    </button>

                </div>

            </div>

        </div>
    );
}