"use client";

import { useState, useEffect } from "react";
import { Maximize2, Loader2 } from "lucide-react";

export function SDOImage({ timestamp }: { timestamp: number }) {
  const [loading, setLoading] = useState(true);
  const imageUrl = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg?t=${timestamp}`;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
  }, [timestamp]);

  return (
    <div className="glass-panel p-5 flex flex-col h-full min-h-[320px] group relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 z-10">
        <h3 className="text-[14px] font-semibold text-brand-text">Live Solar View</h3>
        <span className="text-[10px] uppercase tracking-wider text-brand-muted bg-black/20 px-2 py-0.5 rounded border border-brand-border">NASA SDO</span>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-brand-amber">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt="NASA Solar Dynamics Observatory AIA 304" 
          className={`h-full object-contain rounded-full shadow-[0_0_20px_rgba(242,166,90,0.15)] transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
        />
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square border border-brand-amber/10 rounded-full scale-110 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square border border-brand-amber/5 rounded-full scale-125 pointer-events-none"></div>
      </div>

      <a 
        href="https://sdo.gsfc.nasa.gov/data/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 rounded border border-brand-border text-brand-muted hover:text-brand-text transition-colors opacity-0 group-hover:opacity-100 z-10"
        title="View on NASA SDO"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
