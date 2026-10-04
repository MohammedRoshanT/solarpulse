"use client";

import { SpaceEvent, SourceMeta } from "@/lib/types";
import { format } from "date-fns";
import { AlertCircle, Zap, Activity, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

export function EventTimeline({ events, meta }: { events?: SpaceEvent[], meta?: SourceMeta }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!events || events.length === 0) {
    return (
      <div className="glass-panel p-6" id="events">
        <h2 className="text-xl font-semibold text-brand-text mb-6">Recent Events & Alerts</h2>
        <div className="py-12 text-center text-brand-muted border border-brand-border/50 rounded-lg border-dashed">
          {meta?.status === "unavailable" ? "Event data is currently unavailable." : "No significant space weather events recorded in the recent period."}
        </div>
      </div>
    );
  }

  const displayEvents = expanded ? events : events.slice(0, 8);

  const getIcon = (kind: string) => {
    switch (kind) {
      case "flare": return <Zap className="w-4 h-4 text-brand-warning" />;
      case "geomagnetic_storm": return <Activity className="w-4 h-4 text-brand-severe" />;
      case "cme": return <Globe className="w-4 h-4 text-brand-accent" />;
      default: return <AlertCircle className="w-4 h-4 text-brand-accent" />;
    }
  };

  return (
    <div className="glass-panel p-6" id="events">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-brand-text">Recent Events & Alerts</h2>
        {meta?.status === "unavailable" && <span className="bg-brand-severe/20 text-brand-severe px-2 py-1 rounded text-[11px] uppercase font-bold tracking-wider">Partial Outage</span>}
      </div>

      <div className="space-y-4">
        {displayEvents.map((evt, i) => {
          const isHistorical = (new Date().getTime() - new Date(evt.time).getTime()) > 24 * 60 * 60 * 1000;
          return (
          <div key={evt.id} className="group relative pl-6 border-l border-brand-border/50 pb-4 last:pb-0 last:border-transparent">
            <div className="absolute -left-[9px] top-1 bg-[#050912] p-0.5 rounded-full border border-brand-border">
              {getIcon(evt.kind)}
            </div>
            
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                  <div className="text-[14px] font-medium text-brand-text group-hover:text-white transition-colors leading-tight">
                    <span className="text-brand-accent uppercase text-[11px] font-bold tracking-wider mr-2 sm:hidden">[{evt.kind.replace('_', ' ')}]</span>
                    {evt.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {isHistorical && <span className="text-[11px] font-semibold text-brand-warning/80 bg-brand-warning/10 px-1.5 py-0.5 rounded">PAST</span>}
                    <span className="text-[11px] sm:text-[12px] bg-brand-panel border border-brand-border px-2 py-0.5 rounded text-brand-muted">{evt.source}</span>
                    <span className="text-[11px] sm:text-[12px] font-mono text-brand-muted">{format(new Date(evt.time), "MMM dd, HH:mm 'UTC'")}</span>
                  </div>
                </div>
                {evt.detail && (
                  <p className="text-[13px] text-brand-muted mt-2 leading-relaxed break-words line-clamp-3 sm:line-clamp-none">{evt.detail}</p>
                )}
              </div>
          </div>
        )})}
      </div>

      {events.length > 8 && !expanded && (
        <button 
          onClick={() => setExpanded(true)}
          className="mt-6 w-full py-2 bg-brand-panel hover:bg-white/5 border border-brand-border rounded text-[13px] text-brand-text transition-colors flex items-center justify-center gap-2"
        >
          Show more events <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
