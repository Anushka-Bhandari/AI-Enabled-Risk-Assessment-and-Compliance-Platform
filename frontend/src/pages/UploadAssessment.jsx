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
  ShieldCheck,
  LayoutDashboard,
  ScrollText,
  AlertTriangle,
  Search,
  Users,
  Building2,
  Radio,
  ClipboardCheck,
  History,
  FileBarChart2,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ACCEPTED_TYPES = ["pdf", "docx"];
const MAX_FILE_SIZE_MB = 25;

/* ------------------------------------------------------------------ */
/*  Design tokens — matches SecurityCommandCenter.jsx / QuestionnaireAssessment.jsx / NewAssessment.jsx / AssessmentResult.jsx */
/*  bg-deep   #020817   page background                                */
/*  bg-panel  #0B1120   sidebar / header                                */
/*  bg-card   #111827   card surfaces                                   */
/*  accent    cyan  #22D3EE   primary glow / signature                  */
/* ------------------------------------------------------------------ */

const NAV_SECTIONS = [
  {
    section: "OPERATIONS",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { key: "activity-logs", label: "Activity Logs", icon: ScrollText, path: "/activity-logs" },
      { key: "alerts", label: "Alerts", icon: AlertTriangle, path: "/alerts" },
      { key: "investigations", label: "Investigations", icon: Search, path: "/investigations" },
    ],
  },
  {
    section: "MONITORING",
    items: [
      { key: "faculty-activity", label: "Faculty Activity", icon: Users, path: "/faculty-activity" },
      { key: "departments", label: "Departments", icon: Building2, path: "/departments" },
      { key: "event-stream", label: "Event Stream", icon: Radio, path: "/event-stream" },
    ],
  },
  {
    section: "ASSESSMENT",
    items: [
      { key: "new-assessment", label: "New Assessment", icon: ClipboardCheck, path: "/assessments/new" },
      { key: "assessment-history", label: "Assessment History", icon: History, path: "/assessment-history" },
      { key: "compliance-reports", label: "Compliance Reports", icon: FileBarChart2, path: "/compliance-reports" },
    ],
  },
  {
    section: "SETTINGS",
    items: [{ key: "configuration", label: "Configuration", icon: Settings, path: "/configuration" }],
  },
];

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function UploadAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const assessmentId = location.state?.assessmentId;

  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const validateAndAddFiles = (incoming) => {
    setUploadError("");
    const validFiles = [];

    Array.from(incoming).forEach((file) => {
      const extension = file.name.split(".").pop().toLowerCase();

      const sizeMb = file.size / (1024 * 1024);

      console.log("Extension:", extension);

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
      setProcessingStep((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
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

      const uploadResponse = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const documentIds = uploadResponse.data.document_ids;

      const assessmentResponse = await axios.post(
        `${API_BASE_URL}/assessment/run`,
        {
          assessment_id: assessmentId,
          selected_document_ids: documentIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultAssessmentId = assessmentResponse.data.assessment_id;

      clearInterval(stepTimer);
      navigate("/assessment/result", {
        state: {
          assessmentId: resultAssessmentId,
        },
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
    <div className="min-h-screen w-full bg-[#020817] text-slate-200 flex font-sans antialiased">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-[#0B1120] border-r border-white/[0.06] z-40 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        <div className="relative z-10 flex items-center justify-between px-6 py-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
              <span className="absolute inset-0 rounded-xl border border-cyan-400/40 animate-ping opacity-40" />
              <ShieldCheck className="w-5 h-5 text-cyan-300" strokeWidth={2.25} />
            </div>
            <div>
              <p className="font-semibold tracking-wide text-sm text-white leading-tight">
                CommandCenter
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-cyan-400/70 font-mono">
                Univ. Security Ops
              </p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative z-10 flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          {NAV_SECTIONS.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-500 font-mono">
                {group.section}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSidebarOpen(false);
                        navigate(item.path);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? "bg-cyan-400/[0.08] text-white border border-cyan-400/20 shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100 border border-transparent"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300"}`}
                        strokeWidth={2}
                      />
                      {item.label}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-cyan-400/70" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative z-10 px-4 pb-6 pt-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-slate-100 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-[#0B1120]/85 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center gap-4 px-4 sm:px-8 py-4">
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            <div className="min-w-0 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                  Upload compliance evidence
                </h1>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Evidentiary Documentation
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 flex items-center justify-center font-semibold text-xs">
                {getInitials("Security Admin")}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 space-y-6">
          <p className="text-sm text-slate-400 max-w-xl -mt-1">
            Provide policy documents, control registers, or audit reports. Our AI models
            will extract and map controls automatically.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Drop Zone */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8">
                {!isProcessing ? (
                  <>
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center px-6 py-14 group ${
                        isDragging
                          ? "border-cyan-400/60 bg-cyan-400/[0.06] scale-[1.01]"
                          : "border-white/15 hover:border-cyan-400/40 hover:bg-white/[0.02]"
                      }`}
                    >
                      {isDragging && (
                        <span className="absolute inset-0 rounded-2xl bg-cyan-400/[0.04] animate-pulse" />
                      )}

                      <div
                        className={`w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                          isDragging ? "scale-110" : ""
                        }`}
                      >
                        <UploadCloud className="w-8 h-8 text-cyan-300" strokeWidth={1.75} />
                      </div>

                      <p className="font-semibold text-slate-200">Drag &amp; drop documents here</p>
                      <p className="text-sm text-slate-500 mt-1">or click to browse from your device</p>
                      <p className="text-xs text-slate-500 mt-3 font-mono">
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
                      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-300">{uploadError}</p>
                      </div>
                    )}

                    {files.length > 0 && (
                      <div className="mt-6 space-y-2.5">
                        {files.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:border-white/20"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText className="w-5 h-5 text-cyan-300 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-500 font-mono">{formatSize(file.size)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 shrink-0"
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
                      className="w-full mt-7 flex items-center justify-center gap-2 bg-cyan-400 text-[#020817] font-semibold py-3.5 rounded-xl shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] transition-all duration-300 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      Process {files.length || ""} Document{files.length === 1 ? "" : "s"}
                    </button>
                  </>
                ) : (
                  <div className="py-14 flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 mb-7">
                      <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-cyan-400 border-b-transparent border-l-transparent animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-cyan-300 animate-pulse" />
                      </div>
                    </div>

                    <p className="font-mono text-sm font-semibold text-slate-200 tracking-wide">
                      {PROCESSING_STEPS[processingStep]}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      This can take up to a minute for larger documents.
                    </p>

                    <div className="w-full max-w-sm mt-8 space-y-3">
                      {[0, 1, 2].map((row) => (
                        <div key={row} className="h-3 rounded-full bg-white/[0.06] overflow-hidden relative">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400/30 via-cyan-400/70 to-cyan-400/30 animate-pulse rounded-full"
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
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <ListChecks className="w-5 h-5 text-cyan-300" />
                  <h3 className="font-semibold text-white text-sm">Document Guidelines</h3>
                </div>

                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    Upload the most recent version of each policy document.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    Include control registers, audit reports, or SOC attestations.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    Redact personally identifiable information where possible.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    Ensure scanned PDFs are text-searchable for accurate extraction.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    Files remain encrypted and tenant-isolated after upload.
                  </li>
                </ul>

                <div className="mt-6 rounded-2xl bg-amber-500/10 border border-amber-400/30 px-4 py-3 flex items-start gap-2.5">
                  <ShieldAlert className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200 leading-relaxed">
                    AI-extracted controls are advisory. A compliance reviewer will validate
                    flagged gaps before final reporting.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/assessment/result", { state: { assessmentId } })}
                  className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-cyan-300 border border-cyan-400/20 rounded-xl py-2.5 transition-all duration-300 hover:bg-cyan-400/[0.08]"
                >
                  Skip for now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}