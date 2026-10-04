"use client";

import { Scales } from "@/lib/types";
import { Satellite, Radio, Compass, Users, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

export function ImpactSection({ scales }: { scales?: Scales | null }) {
  const g = scales?.g || 0;
  const s = scales?.s || 0;
  const r = scales?.r || 0;

  const impacts = [
    {
      title: "Satellites & Spacecraft",
      icon: Satellite,
      desc: "Surface charging, drag on low-Earth orbit satellites, and radiation damage to electronics.",
      level: Math.max(g, s) >= 3 ? "High" : Math.max(g, s) >= 1 ? "Moderate" : "Low",
      trigger: Math.max(g, s)
    },
    {
      title: "Navigation (GNSS)",
      icon: Compass,
      desc: "Ionospheric disturbances can degrade GPS positioning accuracy and lock.",
      level: g >= 3 ? "High" : g >= 1 ? "Moderate" : "Low",
      trigger: g
    },
    {
      title: "HF Radio Communication",
      icon: Radio,
      desc: "Solar flares cause ionospheric changes that absorb high-frequency radio waves.",
      level: r >= 3 ? "High" : r >= 1 ? "Moderate" : "Low",
      trigger: r
    },
    {
      title: "Astronauts & Aviation",
      icon: Users,
      desc: "Solar energetic particles can present radiation hazards during severe events.",
      level: s >= 3 ? "High" : s >= 1 ? "Moderate" : "Low",
      trigger: s
    }
  ];

  return (
    <div className="space-y-6" id="impact">
      <h2 className="text-xl font-semibold text-brand-text px-2">Earth & Mission Impact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {impacts.map((imp, i) => {
          const Icon = imp.icon;
          const levelColor = 
            imp.level === "High" ? "text-brand-severe bg-brand-severe/10 border-brand-severe/30" : 
            imp.level === "Moderate" ? "text-brand-warning bg-brand-warning/10 border-brand-warning/30" : 
            "text-brand-success bg-brand-success/10 border-brand-success/30";
          
          return (
            <div key={i} className="glass-panel p-5 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-5 h-5 text-brand-accent" />
                <h3 className="text-[15px] font-medium text-brand-text">{imp.title}</h3>
              </div>
              <p className="text-[13px] text-brand-muted mb-4 flex-1">{imp.desc}</p>
              
              <div className="border-t border-brand-border/40 pt-3 mt-auto flex items-center justify-between">
                <span className="text-[12px] text-brand-muted uppercase tracking-wide">Current Relevance</span>
                <span className={clsx("text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", levelColor)}>
                  {imp.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-[13px] text-brand-muted">
        <span className="font-semibold text-brand-text">How it works:</span>
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2">
          <span>Sun</span> <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2">
          <span>Solar Wind / CME</span> <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2">
          <span>Earth&apos;s Magnetosphere</span> <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
        </div>
        <div>Impact Effects</div>
      </div>
    </div>
  );
}
