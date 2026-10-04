import { DashboardStatus, Scales } from "@/lib/types";
import { AlertTriangle, Activity, CheckCircle, HelpCircle } from "lucide-react";
import { clsx } from "clsx";

export function StatusCard({ status, scales }: { status?: DashboardStatus, scales?: Scales | null }) {
  if (!status) return <div className="glass-panel p-6 animate-pulse h-full min-h-[200px]" />;

  const Icon = status.level === "Quiet" ? CheckCircle : 
               status.level === "Elevated" ? Activity : 
               status.level === "Storm" ? AlertTriangle : HelpCircle;

  const colorClass = status.level === "Quiet" ? "text-brand-success" : 
                     status.level === "Elevated" ? "text-brand-warning" : 
                     status.level === "Storm" ? "text-brand-severe" : "text-brand-muted";

  return (
    <div className="glass-panel glass-panel-strong p-6 h-full flex flex-col relative group transition-transform hover:-translate-y-[2px] duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className={clsx("w-8 h-8", colorClass)} />
          <div>
            <h2 className="text-[14px] text-brand-muted uppercase tracking-wider font-semibold">Current Status</h2>
            <div className={clsx("text-2xl font-semibold tracking-wide", colorClass)}>{status.level}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[12px] text-brand-muted font-mono">NOAA Scales</div>
          <div className="flex gap-2 mt-1">
            <span className="bg-brand-panel px-2 py-0.5 rounded text-[12px] font-mono border border-brand-border" title="Geomagnetic Storm">
              G{scales?.g ?? '-'}
            </span>
            <span className="bg-brand-panel px-2 py-0.5 rounded text-[12px] font-mono border border-brand-border" title="Solar Radiation Storm">
              S{scales?.s ?? '-'}
            </span>
            <span className="bg-brand-panel px-2 py-0.5 rounded text-[12px] font-mono border border-brand-border" title="Radio Blackout">
              R{scales?.r ?? '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 mt-4">
        <p className="text-[15px] text-brand-text mb-4">
          {status.level === "Quiet" && "Space weather conditions are currently nominal with no significant activity affecting Earth."}
          {status.level === "Elevated" && "Space weather conditions are elevated. Minor impacts to vulnerable systems are possible."}
          {status.level === "Storm" && "Active space weather storm conditions detected. Impacts to satellites, navigation, and power grids are possible."}
          {status.level === "Unknown" && "Status currently unavailable due to missing telemetry."}
        </p>

        <ul className="space-y-2 text-[14px] text-brand-muted">
          {status.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 flex-shrink-0" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-brand-border/50 text-[12px] text-brand-muted italic flex justify-between items-center">
        <span>Educational dashboard status</span>
        <span>Derived from NOAA scales and observations</span>
      </div>
    </div>
  );
}
