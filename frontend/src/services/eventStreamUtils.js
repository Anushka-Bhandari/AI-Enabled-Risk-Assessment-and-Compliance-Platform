/**
 * eventStreamUtils.js
 *
 * Shared, framework-agnostic helpers for the Live Event Stream feature.
 * Keeping severity mapping in one place means EventCard, EventStats, and
 * EventFilters can never disagree on what "Critical" looks like.
 */

// Backend sends `status` as INFO / WARNING / CRITICAL today, but this
// normalizer also accepts a few common synonyms (HIGH/MEDIUM/LOW,
// SUCCESS/ERROR) so the UI doesn't break if the backend vocabulary
// drifts without frontend changes.
export function normalizeSeverity(rawStatus) {
  const status = String(rawStatus || "").toUpperCase();

  if (["CRITICAL", "HIGH", "ERROR", "FAILURE"].includes(status)) return "CRITICAL";
  if (["WARNING", "MEDIUM", "ALERT"].includes(status)) return "WARNING";
  return "INFO"; // INFO, LOW, SUCCESS, or unrecognized -> treat as informational
}

export const SEVERITY_STYLES = {
  CRITICAL: {
    label: "Critical",
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    dot: "bg-red-500",
    glow: "shadow-[0_0_10px_0_rgba(248,113,113,0.6)]",
    chart: "#F87171",
  },
  WARNING: {
    label: "Warning",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
    glow: "shadow-[0_0_10px_0_rgba(251,191,36,0.6)]",
    chart: "#FBBF24",
  },
  INFO: {
    label: "Info",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    dot: "bg-cyan-500",
    glow: "shadow-[0_0_10px_0_rgba(34,211,238,0.6)]",
    chart: "#22D3EE",
  },
};

export const SEVERITY_ORDER = ["CRITICAL", "WARNING", "INFO"];

// event_type is open-ended (LOGIN, FILE_ACCESS, FAILED_LOGIN, ALERT, ...)
// so instead of hardcoding a lookup, just present it as a clean neutral
// chip: "FAILED_LOGIN" -> "Failed Login".
export function formatEventType(eventType) {
  if (!eventType) return "Unknown";
  return eventType
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatClockTime(timestamp) {
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", { hour12: false });
}

export const MAX_EVENTS_IN_MEMORY = 200;