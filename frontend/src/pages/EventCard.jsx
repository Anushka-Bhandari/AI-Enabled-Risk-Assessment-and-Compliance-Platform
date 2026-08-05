import React from "react";
import { motion } from "framer-motion";
import { User, Building2, Network, Laptop2, MapPin, Clock } from "lucide-react";
import { normalizeSeverity, SEVERITY_STYLES, formatEventType, formatClockTime } from "../services/eventStreamUtils";

/**
 * EventCard
 *
 * Renders a single security event. Pure presentational component — all
 * animation-on-arrival behavior lives here (slide down + fade in) so the
 * parent list only has to mount/unmount it inside an AnimatePresence.
 */
function EventCard({ event }) {
  const severity = normalizeSeverity(event.status);
  const style = SEVERITY_STYLES[severity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className={`relative rounded-xl border ${style.border} bg-white/[0.03] backdrop-blur-xl p-4 sm:p-5 overflow-hidden`}
    >
      {/* left accent bar, reinforces severity at a glance without reading text */}
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${style.dot}`} />

      <div className="pl-3">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot} ${style.glow}`} />
            <span className={`text-[11px] font-semibold uppercase tracking-wide ${style.text}`}>
              {style.label}
            </span>
            <h4 className="text-sm font-semibold text-white truncate">{event.event_name}</h4>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10 bg-white/[0.04] text-slate-300">
              {formatEventType(event.event_type)}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <Clock className="w-3 h-3" />
              {formatClockTime(event.timestamp)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2.5">
          <MetaField icon={User} label="User" value={event.user_name} />
          <MetaField icon={Building2} label="Department" value={event.department} />
          <MetaField icon={Network} label="IP Address" value={event.ip_address} mono />
          <MetaField icon={Laptop2} label="Device" value={event.device} />
          <MetaField icon={MapPin} label="Location" value={event.location} />
        </div>
      </div>
    </motion.div>
  );
}

function MetaField({ icon: Icon, label, value, mono }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">
        <Icon className="w-3 h-3" />
        {label}
      </p>
      <p className={`text-xs text-slate-300 truncate font-medium ${mono ? "font-mono" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}

export default React.memo(EventCard);