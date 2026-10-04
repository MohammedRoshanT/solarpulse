import { SourceMeta } from "@/lib/types";
import { format } from "date-fns";
import { Info } from "lucide-react";
import { clsx } from "clsx";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  meaning: string;
  meta?: SourceMeta;
  tooltipText: string;
}

export function MetricCard({ label, value, unit, meaning, meta, tooltipText }: MetricCardProps) {
  if (!meta) {
    return <div className="glass-panel p-5 animate-pulse min-h-[140px]" />;
  }

  const isStale = meta.status === "stale";
  const isUnavailable = meta.status === "unavailable";
  const dataTime = meta.dataTime ? format(new Date(meta.dataTime), "HH:mm 'UTC'") : "--:--";

  return (
    <div className="glass-panel p-5 flex flex-col justify-between transition-transform hover:-translate-y-[2px] duration-300 group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1.5">
          <h3 className="text-[13px] font-semibold text-brand-muted uppercase tracking-wider">{label}</h3>
          <div className="relative group/tooltip cursor-help">
            <Info className="w-3.5 h-3.5 text-brand-muted/70 hover:text-brand-text transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-brand-panel-strong border border-brand-border rounded shadow-xl text-[12px] text-brand-text opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 pointer-events-none">
              {tooltipText}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isUnavailable && <span className="bg-brand-severe/20 text-brand-severe px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Unavailable</span>}
          {isStale && !isUnavailable && <span className="bg-brand-warning/20 text-brand-warning px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Delayed</span>}
          {!isStale && !isUnavailable && <span className="bg-brand-success/20 text-brand-success px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Live</span>}
        </div>
      </div>

      <div className="flex items-baseline gap-2 my-1">
        <span className={clsx("text-4xl font-mono font-medium tracking-tight", isUnavailable ? "text-brand-muted" : "text-brand-text")}>
          {isUnavailable ? "--" : value}
        </span>
        {unit && <span className="text-[14px] font-mono text-brand-muted">{unit}</span>}
      </div>

      <div className="text-[13px] text-brand-text/80 mb-3 line-clamp-1">{meaning}</div>

      <div className="flex justify-between items-center text-[11px] font-mono text-brand-muted/60 border-t border-brand-border/40 pt-2">
        <span>{meta.source}</span>
        <span>{dataTime}</span>
      </div>
    </div>
  );
}
