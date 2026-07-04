import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getDashboard,
    getAnalytics
} from "../services/dashboardServices";

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {

            try {

                const dashboardResponse =
                    await getDashboard();

                const analyticsResponse =
                    await getAnalytics();

                setDashboardData(
                    dashboardResponse.data
                );

                setAnalytics(
                    analyticsResponse.data
                );

            } catch (error) {

                console.error(error);

                if (
                    error.response &&
                    error.response.status === 401
                ) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }

            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-semibold">
                    Loading Dashboard...
                </h1>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-slate-100 flex">

            {/* SIDEBAR */}
            <aside className="w-72 bg-linear-to-b from-[#002B6B] to-[#001A45] text-white p-6">

                <h1 className="text-3xl font-bold">
                    University Risk
                </h1>

                <p className="text-blue-200 mt-2">
                    Assessment Platform
                </p>

                <nav className="mt-12 space-y-3">

                    <button className="w-full text-left p-4 rounded-xl bg-blue-700">
                        Dashboard
                    </button>

                    <button className="w-full text-left p-4 rounded-xl hover:bg-blue-800">
                        Assessments
                    </button>

                    <button className="w-full text-left p-4 rounded-xl hover:bg-blue-800">
                        Risks
                    </button>

                    <button className="w-full text-left p-4 rounded-xl hover:bg-blue-800">
                        Reports
                    </button>

                    <button className="w-full text-left p-4 rounded-xl hover:bg-blue-800">
                        Compliance
                    </button>

                </nav>

            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1">

                {/* TOP NAVBAR */}
                <div className="bg-white px-10 py-6 flex justify-between items-center shadow-sm">

                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Dashboard
                        </h2>

                        <p className="text-slate-500">
                            Overview of university risks
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
                    >
                        Logout
                    </button>

                </div>

                <div className="p-10">

                    {/* WELCOME */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">

                        <h2 className="text-4xl font-bold text-slate-900">
                            Welcome, {dashboardData?.user} 👋
                        </h2>

                        <p className="text-slate-500 mt-3">
                            Manage risk assessments and compliance reports
                            from one centralized dashboard.
                        </p>

                    </div>

                    {/* STATS */}
                    <div className="grid lg:grid-cols-4 gap-6 mt-8">

                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 className="text-slate-500">
                                Total Assessments
                            </h3>

                            <p className="text-4xl font-bold text-slate-900 mt-3">
                                {analytics?.total_assessments || 0}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 className="text-slate-500">
                                High Risks
                            </h3>

                            <p className="text-4xl font-bold text-red-600 mt-3">
                                5
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 className="text-slate-500">
                                Medium Risks
                            </h3>

                            <p className="text-4xl font-bold text-orange-500 mt-3">
                                11
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 className="text-slate-500">
                                Compliance Score
                            </h3>

                            <p className="text-4xl font-bold text-green-600 mt-3">
                                87%
                            </p>
                        </div>

                    </div>

                    {/* RECENT ASSESSMENTS */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">

                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Recent Assessments
                        </h2>

                        <div className="space-y-4">

                            {dashboardData?.history?.length > 0 ? (

                                dashboardData.history.map((assessment) => (

                                    <div
                                        key={assessment.assessment_id}
                                        className="border border-slate-200 p-5 rounded-2xl"
                                    >

                                        <h3 className="font-semibold text-lg">
                                            Assessment #{assessment.assessment_id}
                                        </h3>

                                        <p className="text-slate-500 mt-1">
                                            University ID:
                                            {" "}
                                            {assessment.university_id}
                                        </p>

                                        <p className="text-slate-500">
                                            Submitted:
                                            {" "}
                                            {assessment.submitted_at}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <div className="text-slate-500">
                                    No assessments found.
                                </div>

                            )}

                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="grid lg:grid-cols-3 gap-6 mt-8">

                        <button className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-semibold">
                            New Assessment
                        </button>

                        <button className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-2xl font-semibold">
                            Generate Report
                        </button>

                        <button className="bg-purple-600 hover:bg-purple-700 text-white p-5 rounded-2xl font-semibold">
                            View Risks
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}