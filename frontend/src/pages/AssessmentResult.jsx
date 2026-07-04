import { useLocation, useNavigate } from "react-router-dom";

export default function AssessmentResult() {

    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-semibold">
                    No assessment result found.
                </h1>
            </div>
        );
    }

    const {
        assessment_id,
        risk_level,
        compliance_score,
        implemented_controls = [],
        missing_controls = []
    } = state;

    const riskColor =
        risk_level === "Low"
            ? "text-green-600"
            : risk_level === "Medium"
                ? "text-orange-500"
                : "text-red-600";

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}
            <div className="bg-white shadow-sm border-b">

                <div className="max-w-7xl mx-auto px-8 py-6">

                    <h1 className="text-4xl font-bold text-[#0B2A66]">
                        Assessment Result
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Cybersecurity & Compliance Evaluation Report
                    </p>

                </div>

            </div>

            <div className="max-w-7xl mx-auto p-8">

                {/* Top Cards */}
                <div className="grid lg:grid-cols-3 gap-6">

                    <div className="bg-white rounded-3xl p-8 shadow-sm">

                        <h3 className="text-slate-500">
                            Assessment ID
                        </h3>

                        <p className="text-4xl font-bold mt-3 text-[#0B2A66]">
                            #{assessment_id}
                        </p>

                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm">

                        <h3 className="text-slate-500">
                            Compliance Score
                        </h3>

                        <p className="text-4xl font-bold mt-3 text-green-600">
                            {compliance_score}%
                        </p>

                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm">

                        <h3 className="text-slate-500">
                            Risk Level
                        </h3>

                        <p
                            className={`text-4xl font-bold mt-3 ${riskColor}`}
                        >
                            {risk_level}
                        </p>

                    </div>

                </div>

                {/* Compliance Meter */}
                <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">

                    <h2 className="text-2xl font-bold text-[#0B2A66] mb-6">
                        Compliance Overview
                    </h2>

                    <div className="w-full bg-slate-200 rounded-full h-6">

                        <div
                            className="bg-green-600 h-6 rounded-full"
                            style={{
                                width: `${compliance_score}%`
                            }}
                        />

                    </div>

                    <p className="mt-4 text-slate-600">
                        Your organization currently satisfies
                        <span className="font-semibold">
                            {" "} {compliance_score}% {" "}
                        </span>
                        of the assessed compliance requirements.
                    </p>

                </div>

                {/* Controls */}
                <div className="grid lg:grid-cols-2 gap-6 mt-8">

                    {/* Implemented */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">

                        <h2 className="text-2xl font-bold text-green-600 mb-6">
                            Implemented Controls
                        </h2>

                        {implemented_controls.length > 0 ? (

                            <ul className="space-y-3">

                                {implemented_controls.map((control) => (

                                    <li
                                        key={control}
                                        className="bg-green-50 border border-green-200 p-4 rounded-xl"
                                    >
                                        ✅ {control}
                                    </li>

                                ))}

                            </ul>

                        ) : (

                            <p className="text-slate-500">
                                No implemented controls found.
                            </p>

                        )}

                    </div>

                    {/* Missing */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">

                        <h2 className="text-2xl font-bold text-red-600 mb-6">
                            Missing Controls
                        </h2>

                        {missing_controls.length > 0 ? (

                            <ul className="space-y-3">

                                {missing_controls.map((control) => (

                                    <li
                                        key={control}
                                        className="bg-red-50 border border-red-200 p-4 rounded-xl"
                                    >
                                        ❌ {control}
                                    </li>

                                ))}

                            </ul>

                        ) : (

                            <p className="text-slate-500">
                                No missing controls found.
                            </p>

                        )}

                    </div>

                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">

                    <h2 className="text-2xl font-bold text-[#0B2A66] mb-6">
                        Recommendations
                    </h2>

                    <ul className="space-y-4 text-slate-700">

                        <li>
                            • Strengthen cybersecurity awareness programs.
                        </li>

                        <li>
                            • Review and update data protection policies.
                        </li>

                        <li>
                            • Conduct periodic vulnerability assessments.
                        </li>

                        <li>
                            • Implement continuous compliance monitoring.
                        </li>

                    </ul>

                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">

                    <h2 className="text-2xl font-bold text-[#0B2A66] mb-4">
                        Risk Summary
                    </h2>

                    <p className="text-slate-600 leading-relaxed">

                        {risk_level === "Low" &&
                            "Your institution demonstrates a strong cybersecurity posture and good compliance practices."
                        }

                        {risk_level === "Medium" &&
                            "Several important controls require improvement to strengthen compliance and reduce operational risk."
                        }

                        {risk_level === "High" &&
                            "Critical security and compliance gaps were identified. Immediate remediation is recommended."
                        }

                    </p>

                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">

                    <button
                        onClick={() => navigate("/new-assessment")}
                        className="border px-8 py-4 rounded-2xl"
                    >
                        New Assessment
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-[#0B2A66] text-white px-8 py-4 rounded-2xl"
                    >
                        Back to Dashboard
                    </button>

                    <button
                        className="bg-green-600 text-white px-8 py-4 rounded-2xl"
                    >
                        Download Report
                    </button>

                </div>

            </div>

        </div>
    );
}