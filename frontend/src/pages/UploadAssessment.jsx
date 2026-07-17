import React, { useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
    UploadCloud,
    FileText,
    FileCheck2,
    X,
    Loader2,
    AlertCircle,
    Sparkles,
    ListChecks,
    ShieldAlert,
    ArrowRight,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ACCEPTED_TYPES = [".pdf",".docx"];
const MAX_FILE_SIZE_MB = 25;

export default function UploadAssessment() {
    const navigate = useNavigate();
    const location = useLocation();
    const assessmentId = location.state?.assessmentId;

    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [processingStep, setProcessingStep] = useState(0);

    const fileInputRef = useRef(null);

    const PROCESSING_STEPS = [
        "Uploading evidentiary documents…",
        "Extracting Controls via AI LLM Models…",
        "Cross-referencing control mappings…",
        "Finalizing document ingestion…",
    ];

    const validateAndAddFiles = (incoming) => {
        setUploadError("");
        const validFiles = [];

        Array.from(incoming).forEach((file) => {
            const extension = "." + file.name.split(".").pop().toLowerCase();
            const sizeMb = file.size / (1024 * 1024);

            if (!ACCEPTED_TYPES.includes(extension)) {
                setUploadError(`Unsupported file type: ${file.name}`);
                return;
            }
            if (sizeMb > MAX_FILE_SIZE_MB) {
                setUploadError(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
                return;
            }
            validFiles.push(file);
        });

        if (validFiles.length) {
            setFiles((prev) => [...prev, ...validFiles]);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) {
            validateAndAddFiles(e.dataTransfer.files);
        }
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleBrowse = (e) => {
        if (e.target.files?.length) {
            validateAndAddFiles(e.target.files);
        }
        e.target.value = "";
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const formatSize = (bytes) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleUpload = async () => {
        if (!files.length) return;

        setIsProcessing(true);
        setUploadError("");
        setProcessingStep(0);

        const stepTimer = setInterval(() => {
            setProcessingStep((prev) =>
                prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev
            );
        }, 1400);

        try {
            const token = localStorage.getItem("token");

            console.log("TOKEN =", token);
            const formData = new FormData();

            files.forEach((file) => {
                formData.append("documents", file);
            });
            if (assessmentId) {
                formData.append("assessment_id", assessmentId);
            }

            const uploadResponse = await axios.post(
    `${API_BASE_URL}/documents/upload`,
    formData,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

const documentIds =
    uploadResponse.data.document_ids;

    const assessmentResponse =
    await axios.post(
        `${API_BASE_URL}/assessment/run`,
        {
            assessment_id: assessmentId,
            selected_document_ids: documentIds
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const resultAssessmentId =
    assessmentResponse.data.assessment_id;

            clearInterval(stepTimer);
            navigate("/assessment/result", {
    state: {
        assessmentId: resultAssessmentId
    }
});
        } catch (err) {
            clearInterval(stepTimer);
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Document processing failed. Please try again.";
            setUploadError(message);
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <div className="bg-[#0B2A66] text-white">
                <div className="max-w-4xl mx-auto px-6 pt-10 pb-10">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-200/80">
                            Evidentiary Documentation
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Upload compliance evidence
                    </h1>
                    <p className="text-blue-100/70 text-sm mt-2 max-w-xl">
                        Provide policy documents, control registers, or audit reports.
                        Our AI models will extract and map controls automatically.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Drop Zone */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/70 p-6 sm:p-8">
                        {!isProcessing ? (
                            <>
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center px-6 py-14 group ${isDragging
                                            ? "border-[#0B2A66] bg-blue-50 scale-[1.01]"
                                            : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                                        }`}
                                >
                                    {isDragging && (
                                        <span className="absolute inset-0 rounded-2xl bg-blue-500/5 animate-pulse" />
                                    )}

                                    <div
                                        className={`w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${isDragging ? "scale-110" : ""
                                            }`}
                                    >
                                        <UploadCloud className="w-8 h-8 text-[#0B2A66]" strokeWidth={1.75} />
                                    </div>

                                    <p className="font-semibold text-slate-800">
                                        Drag &amp; drop documents here
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        or click to browse from your device
                                    </p>
                                    <p className="text-xs text-slate-400 mt-3 font-mono">
                                        PDF · DOC · DOCX · XLS · XLSX · CSV — max {MAX_FILE_SIZE_MB}MB
                                    </p>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept={ACCEPTED_TYPES.join(",")}
                                        onChange={handleBrowse}
                                        className="hidden"
                                    />
                                </div>

                                {uploadError && (
                                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700">{uploadError}</p>
                                    </div>
                                )}

                                {files.length > 0 && (
                                    <div className="mt-6 space-y-2.5">
                                        {files.map((file, index) => (
                                            <div
                                                key={`${file.name}-${index}`}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 transition-all duration-300 hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <FileText className="w-5 h-5 text-[#0B2A66] shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-slate-800 truncate">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-slate-400 font-mono">
                                                            {formatSize(file.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(index)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shrink-0"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={handleUpload}
                                    disabled={!files.length}
                                    className="w-full mt-7 flex items-center justify-center gap-2 bg-[#0B2A66] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-300 hover:bg-slate-900 hover:scale-[1.01] hover:shadow-xl disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                >
                                    <FileCheck2 className="w-4 h-4" />
                                    Process {files.length || ""} Document{files.length === 1 ? "" : "s"}
                                </button>
                            </>
                        ) : (
                            <div className="py-14 flex flex-col items-center text-center">
                                <div className="relative w-20 h-20 mb-7">
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                                    <div className="absolute inset-0 rounded-full border-4 border-t-[#0B2A66] border-r-[#0B2A66] border-b-transparent border-l-transparent animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="w-7 h-7 text-[#0B2A66] animate-pulse" />
                                    </div>
                                </div>

                                <p className="font-mono text-sm font-semibold text-slate-800 tracking-wide">
                                    {PROCESSING_STEPS[processingStep]}
                                </p>
                                <p className="text-xs text-slate-400 mt-2">
                                    This can take up to a minute for larger documents.
                                </p>

                                <div className="w-full max-w-sm mt-8 space-y-3">
                                    {[0, 1, 2].map((row) => (
                                        <div
                                            key={row}
                                            className="h-3 rounded-full bg-slate-100 overflow-hidden relative"
                                        >
                                            <div
                                                className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-100 via-blue-300 to-blue-100 animate-pulse rounded-full"
                                                style={{ width: `${85 - row * 15}%` }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Guide Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/70 p-6 sticky top-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ListChecks className="w-5 h-5 text-[#0B2A66]" />
                            <h3 className="font-semibold text-slate-800">
                                Document Guidelines
                            </h3>
                        </div>

                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                Upload the most recent version of each policy document.
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                Include control registers, audit reports, or SOC attestations.
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                Redact personally identifiable information where possible.
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                Ensure scanned PDFs are text-searchable for accurate extraction.
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                Files remain encrypted and tenant-isolated after upload.
                            </li>
                        </ul>

                        <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2.5">
                            <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800 leading-relaxed">
                                AI-extracted controls are advisory. A compliance reviewer will
                                validate flagged gaps before final reporting.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/assessment/result", { state: { assessmentId } })}
                            className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#0B2A66] border border-blue-100 rounded-xl py-2.5 transition-all duration-300 hover:bg-blue-50 hover:scale-[1.01]"
                        >
                            Skip for now
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}