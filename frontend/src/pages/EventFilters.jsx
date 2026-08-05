import React from "react";
import { Search, Pause, Play, Trash2, ScrollText, ChevronDown } from "lucide-react";
import { SEVERITY_ORDER, SEVERITY_STYLES } from "../services/eventStreamUtils";

/**
 * EventFilters
 *
 * Search box + severity/type/department dropdowns + stream controls
 * (pause/resume, clear, autoscroll toggle). Fully controlled — all state
 * lives in the parent page.
 */
export default function EventFilters({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  typeFilter,
  onTypeChange,
  departmentFilter,
  onDepartmentChange,
  availableTypes,
  availableDepartments,
  isPaused,
  onTogglePause,
  onClear,
  autoScroll,
  onToggleAutoScroll,
  pendingCount,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by user, IP, location…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-slate-200 placeholder:text-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40"
          />
        </div>

        <Select
          value={severityFilter}
          onChange={onSeverityChange}
          options={[{ value: "ALL", label: "All Severities" }, ...SEVERITY_ORDER.map((s) => ({ value: s, label: SEVERITY_STYLES[s].label }))]}
        />

        <Select
          value={typeFilter}
          onChange={onTypeChange}
          options={[{ value: "ALL", label: "All Event Types" }, ...availableTypes.map((t) => ({ value: t, label: t }))]}
        />

        <Select
          value={departmentFilter}
          onChange={onDepartmentChange}
          options={[{ value: "ALL", label: "All Departments" }, ...availableDepartments.map((d) => ({ value: d, label: d }))]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-white/[0.06]">
        <button
          onClick={onTogglePause}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
            isPaused
              ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/20"
              : "bg-amber-400/10 border-amber-400/30 text-amber-300 hover:bg-amber-400/20"
          }`}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {isPaused ? `Resume${pendingCount ? ` (${pendingCount})` : ""}` : "Pause Stream"}
        </button>

        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 bg-white/[0.02] text-slate-300 hover:border-red-400/30 hover:text-red-300 hover:bg-red-400/[0.06] transition-all duration-200"
        >
          <Trash2 className="w-4 h-4" />
          Clear Events
        </button>

        <button
          onClick={() => onToggleAutoScroll(!autoScroll)}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
            autoScroll
              ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-300"
              : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200"
          }`}
        >
          <ScrollText className="w-4 h-4" />
          Auto-scroll {autoScroll ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-slate-200 outline-none transition-all duration-300 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0B1120] text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );
}