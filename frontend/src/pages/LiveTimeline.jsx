import React, { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Radio, WifiOff, Inbox, PauseCircle } from "lucide-react";
import EventCard from "./EventCard";

/**
 * LiveTimeline
 *
 * Renders the scrollable event feed. Owns the scroll container so it can
 * pin the view to the top when `autoScroll` is on and a new event lands.
 */
export default function LiveTimeline({
  events,
  isLoading,
  connectionStatus, // "connecting" | "connected" | "disconnected"
  isPaused,
  autoScroll,
  hasActiveFilters,
}) {
  const containerRef = useRef(null);
  const prevLengthRef = useRef(events.length);

  useEffect(() => {
    if (autoScroll && events.length > prevLengthRef.current && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevLengthRef.current = events.length;
  }, [events.length, autoScroll]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
        ))}
      </div>
    );
  }

  if (connectionStatus === "disconnected" && events.length === 0) {
    return (
      <EmptyState
        icon={WifiOff}
        title="Not connected to the event stream"
        subtitle="Check your Socket.IO connection — events will appear here automatically once reconnected."
      />
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={hasActiveFilters ? Inbox : Radio}
        title={hasActiveFilters ? "No events match your filters" : "Waiting for live events…"}
        subtitle={
          hasActiveFilters
            ? "Try clearing or adjusting your search and filters."
            : "New security events will stream in here the moment they're generated."
        }
      />
    );
  }

  return (
    <div className="relative">
      {isPaused && (
        <div className="flex items-center gap-2 mb-3 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium">
          <PauseCircle className="w-4 h-4" />
          Stream paused — new events are being counted but not shown. Resume to view them.
        </div>
      )}

      <div ref={containerRef} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 scroll-smooth">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <EventCard key={event.event_id} event={event} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <p className="text-xs text-slate-500 mt-1.5 max-w-sm">{subtitle}</p>
    </div>
  );
}