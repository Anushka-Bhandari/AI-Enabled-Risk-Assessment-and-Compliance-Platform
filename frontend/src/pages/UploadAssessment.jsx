import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadAssessment() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);

        const uploadedFile = e.dataTransfer.files[0];

        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    const handleBrowse = (e) => {
        const uploadedFile = e.target.files[0];

        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    const handleUpload = async () => {

        if (!file) {
            alert("Please select a file first.");
            return;
        }

        console.log("Uploading:", file);

        // Backend API call will come here later

        navigate("/assessment-result", {
            state: {
                assessment_id: 101,
                risk_level: "Medium",
                compliance_score: 76,
                implemented_controls: [
                    "Access Control",
                    "Password Policy",
                    "Data Retention Policy"
                ],
                missing_controls: [
                    "Incident Response Plan",
                    "Vendor Risk Assessment"
                ]
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Header */}
            <div className="bg-white shadow-sm border-b">

                <div className="max-w-7xl mx-auto px-8 py-6">

                    <h1 className="text-4xl font-bold text-[#0B2A66]">
                        Document Assessment
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Upload university policies and compliance
                        documents for AI-powered risk analysis.
                    </p>

                </div>

            </div>

            <div className="max-w-6xl mx-auto p-8">

                {/* Upload Card */}
                <div className="bg-white rounded-3xl p-10 shadow-sm">

                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            border-2 border-dashed rounded-3xl
                            p-12 text-center transition-all duration-300
                            ${
                                dragging
                                    ? "border-[#0B2A66] bg-blue-50"
                                    : "border-slate-300"
                            }
                        `}
                    >

                        <div className="text-6xl mb-4">
                            📄
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900">
                            Drag & Drop Files Here
                        </h2>

                        <p className="text-slate-500 mt-3">
                            Upload PDF, DOCX, Security Policies,
                            Compliance Reports
                        </p>

                        <div className="mt-8">

                            <label
                                htmlFor="file-upload"
                                className="
                                    inline-block
                                    bg-[#0B2A66]
                                    hover:bg-[#081F4D]
                                    text-white
                                    px-6
                                    py-3
                                    rounded-xl
                                    cursor-pointer
                                "
                            >
                                Browse Files
                            </label>

                            <input
                                id="file-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleBrowse}
                                className="hidden"
                            />

                        </div>

                    </div>

                    {/* Selected File */}
                    {file && (

                        <div className="mt-8 bg-slate-50 border rounded-2xl p-5">

                            <h3 className="font-semibold text-slate-900">
                                Selected Document
                            </h3>

                            <p className="mt-2 text-slate-700">
                                📄 {file.name}
                            </p>

                            <p className="text-slate-500 text-sm mt-1">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>

                            <p className="text-green-600 font-medium mt-2">
                                ✓ Ready for AI Analysis
                            </p>

                        </div>

                    )}

                    <button
                        onClick={handleUpload}
                        className="
                            mt-8
                            bg-[#0B2A66]
                            hover:bg-[#081F4D]
                            text-white
                            px-8
                            py-4
                            rounded-2xl
                            font-semibold
                        "
                    >
                        Start AI Analysis
                    </button>

                </div>

                {/* Statistics */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">

                    <div className="bg-white p-6 rounded-3xl shadow-sm">

                        <h3 className="text-slate-500">
                            Supported Formats
                        </h3>

                        <p className="text-4xl font-bold text-[#0B2A66] mt-3">
                            PDF
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm">

                        <h3 className="text-slate-500">
                            AI Controls Checked
                        </h3>

                        <p className="text-4xl font-bold text-green-600 mt-3">
                            30+
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm">

                        <h3 className="text-slate-500">
                            Risk Categories
                        </h3>

                        <p className="text-4xl font-bold text-red-600 mt-3">
                            8
                        </p>

                    </div>

                </div>

                {/* Information Section */}
                <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">

                    <h2 className="text-2xl font-bold text-[#0B2A66] mb-6">
                        How AI Analysis Works
                    </h2>

                    <ul className="space-y-4 text-slate-600">

                        <li>
                            ✅ Upload university cybersecurity and compliance documents.
                        </li>

                        <li>
                            ✅ AI extracts security controls and compliance information.
                        </li>

                        <li>
                            ✅ Missing controls are automatically detected.
                        </li>

                        <li>
                            ✅ Compliance score and risk level are generated.
                        </li>

                        <li>
                            ✅ Recommendations are provided for improvement.
                        </li>

                    </ul>

                </div>

            </div>

        </div>
    );
}