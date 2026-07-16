import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function NewAssessment() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 p-8">

            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="bg-linear-to-r from-[#002B6B] to-[#0047AB] rounded-3xl p-10 text-white mb-10">

                    <h1 className="text-5xl font-bold">
                        New Assessment
                    </h1>

                    <p className="mt-4 text-xl text-blue-100">
                        Select an assessment method to evaluate
                        cybersecurity, compliance, and AI governance risks.
                    </p>

                </div>

                {/* Assessment Options */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Questionnaire Assessment */}
                    <div
                        onClick={() =>
                            navigate("/questionnaire-assessment")
                        }
                        className="cursor-pointer bg-white border rounded-2xl p-8 hover:shadow-lg transition duration-300"
                    >

                        <div className="text-5xl mb-4">
                            📋
                        </div>

                        <h2 className="text-2xl font-bold text-[#0B2A66]">
                            Questionnaire Assessment
                        </h2>

                        <p className="mt-3 text-slate-500">
                            Complete a structured cybersecurity and
                            compliance questionnaire to evaluate
                            institutional risk posture.
                        </p>

                        <button
                            className="mt-6 bg-[#0B2A66] text-white px-6 py-3 rounded-xl"
                        >
                            Start Questionnaire
                        </button>

                    </div>

                    {/* Document Assessment */}
                    <div
                        onClick={() =>
                            navigate("/upload-assessment")
                        }
                        className="
                            cursor-pointer
                            bg-white
                            rounded-3xl
                            p-8
                            shadow-sm
                            border
                            border-slate-200
                            hover:shadow-xl
                            hover:-translate-y-2
                            transition-all
                            duration-300
                            "
                    >

                        <div className="text-5xl mb-4">
                            📄
                        </div>

                        <h2 className="text-2xl font-bold text-[#0B2A66]">
                            Document Assessment
                        </h2>

                        <p className="mt-3 text-slate-500">
                            Upload university policies, compliance
                            reports, and security documents for
                            automated risk analysis.
                        </p>

                        <button
                            className="mt-6 bg-[#0B2A66] text-white px-6 py-3 rounded-xl"
                        >
                            Upload Documents
                        </button>

                    </div>

                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-10">

                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <h3 className="text-slate-500">
                            Assessment Questions
                        </h3>

                        <p className="text-4xl font-bold text-[#0B2A66] mt-2">
                            30+
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <h3 className="text-slate-500">
                            Compliance Checks
                        </h3>

                        <p className="text-4xl font-bold text-green-600 mt-2">
                            15
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <h3 className="text-slate-500">
                            Risk Categories
                        </h3>

                        <p className="text-4xl font-bold text-red-600 mt-2">
                            8
                        </p>
                    </div>

                </div>

                {/* Information Section */}
                <div className="mt-8 bg-white border rounded-2xl p-6">

                    <h3 className="text-xl font-semibold text-[#0B2A66] mb-4">
                        Assessment Methods
                    </h3>

                    <ul className="space-y-3 text-slate-600">

                        <li>
                            ✅ Questionnaire assessment evaluates compliance
                            through 30 structured questions.
                        </li>

                        <li>
                            ✅ Document assessment analyzes uploaded
                            institutional documents.
                        </li>

                        <li>
                            ✅ Both methods generate risk level and
                            compliance score.
                        </li>

                        <li>
                            ✅ Results include recommendations for
                            improving cybersecurity posture.
                        </li>

                    </ul>

                </div>

                <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm">

                    <h3 className="text-2xl font-bold text-[#0B2A66] mb-6">
                        Compare Assessment Methods
                    </h3>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-4">
                                        Feature
                                    </th>
                                    <th className="text-center">
                                        Questionnaire
                                    </th>
                                    <th className="text-center">
                                        Document Upload
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr className="border-b">
                                    <td className="py-4">
                                        Compliance Review
                                    </td>
                                    <td className="text-center">
                                        ✅
                                    </td>
                                    <td className="text-center">
                                        ✅
                                    </td>
                                </tr>

                                <tr className="border-b">
                                    <td className="py-4">
                                        AI Analysis
                                    </td>
                                    <td className="text-center">
                                        ❌
                                    </td>
                                    <td className="text-center">
                                        ✅
                                    </td>
                                </tr>

                                <tr>
                                    <td className="py-4">
                                        Manual Input
                                    </td>
                                    <td className="text-center">
                                        ✅
                                    </td>
                                    <td className="text-center">
                                        ❌
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}