import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ListChecks, ShieldAlert, AlertTriangle, CheckCircle2, Users } from "lucide-react";
import { SEVERITY_ORDER, SEVERITY_STYLES } from "../services/eventStreamUtils";

/**
 * EventStats
 *
 * Right-hand analytics panel: five summary cards + a donut chart showing
 * the Critical / Warning / Info split. `stats` values are running totals
 * owned by the parent page (not just the currently-visible 200 events).
 */
export default function EventStats({ stats }) {
  const { totalToday, critical, warning, info, activeUsers } = stats;

  const distributionData = useMemo(
    () =>
      SEVERITY_ORDER.map((key) => ({
        name: SEVERITY_STYLES[key].label,
        value: key === "CRITICAL" ? critical : key === "WARNING" ? warning : info,
        color: SEVERITY_STYLES[key].chart,
      })),
    [critical, warning, info]
  );

  const hasData = critical + warning + info > 0;

  const cards = [
    { label: "Total Events Today", value: totalToday, icon: ListChecks, glow: "rgba(34,211,238,0.4)", ring: "border-cyan-400/20" },
    { label: "Critical Events", value: critical, icon: ShieldAlert, glow: "rgba(248,113,113,0.4)", ring: "border-red-400/20" },
    { label: "Warning Events", value: warning, icon: AlertTriangle, glow: "rgba(251,191,36,0.4)", ring: "border-amber-400/20" },
    { label: "Successful Events", value: info, icon: CheckCircle2, glow: "rgba(52,211,153,0.4)", ring: "border-emerald-400/20" },
    { label: "Active Users", value: activeUsers, icon: Users, glow: "rgba(129,140,248,0.4)", ring: "border-indigo-400/20" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-2xl border ${card.ring} bg-white/[0.03] backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-0.5`}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 32px -10px ${card.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0px 0 transparent";
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center border"
                  style={{
                    background: card.glow.replace(/[\d.]+\)$/, "0.12)"),
                    borderColor: card.glow.replace(/[\d.]+\)$/, "0.3)"),
                  }}
                >
                  <Icon className="w-4.5 h-4.5 text-white" strokeWidth={2.25} />
                </div>
              </div>
              <p className="text-xl font-bold text-white font-mono leading-none">{card.value}</p>
              <p className="text-[11px] text-slate-500 mt-1.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-1">Live Event Distribution</h3>
        <p className="text-xs text-slate-500 mb-4">Critical · Warning · Info</p>

        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={distributionData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={4}>
                  {distributionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0B1120",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#e2e8f0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {distributionData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[11px] text-slate-400">
                    {d.name} · {d.value}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-[180px] flex items-center justify-center text-xs text-slate-500">
            No events yet — chart will populate as events arrive.
          </div>
        )}
      </div>
    </div>
  );
}