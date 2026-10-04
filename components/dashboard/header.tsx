"use client";

import { Sun, RefreshCw } from "lucide-react";
import { format } from "date-fns";

export function Header({ generatedAt, onRefresh, isRefreshing }: { generatedAt?: string, onRefresh: () => void, isRefreshing: boolean }) {
  const timeStr = generatedAt ? format(new Date(generatedAt), "HH:mm 'UTC'") : "--:-- UTC";
  
  return (
    <header className="sticky top-0 z-50 glass-panel !rounded-none !border-t-0 !border-l-0 !border-r-0 border-b">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sun className="w-6 h-6 text-brand-accent" />
            <div className="absolute inset-0 bg-brand-accent blur-md opacity-30"></div>
          </div>
          <div>
            <h1 className="font-semibold text-[18px] leading-none tracking-wide text-brand-text">Heliowatch</h1>
            <span className="text-[12px] text-brand-muted hidden sm:block mt-1">Space weather, as it happens.</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-[14px] text-brand-muted">
          <a href="#overview" className="hover:text-brand-text transition-colors">Overview</a>
          <a href="#charts" className="hover:text-brand-text transition-colors">Charts</a>
          <a href="#events" className="hover:text-brand-text transition-colors">Events</a>
          <a href="#impact" className="hover:text-brand-text transition-colors">Impact</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[12px] font-mono text-brand-muted bg-brand-panel px-3 py-1.5 rounded-full border border-brand-border">
            <span>Updated {timeStr}</span>
          </div>
          <button 
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full hover:bg-white/5 transition-colors disabled:opacity-50 group"
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-brand-muted group-hover:text-brand-text ${isRefreshing ? 'animate-spin text-brand-accent' : ''}`} />
          </button>
        </div>
      </div>
      {/* Mobile nav (compact) */}
      <div className="md:hidden flex overflow-x-auto gap-4 px-4 py-2 border-t border-brand-border text-[13px] text-brand-muted scrollbar-hide">
        <a href="#overview" className="whitespace-nowrap hover:text-brand-text">Overview</a>
        <a href="#charts" className="whitespace-nowrap hover:text-brand-text">Charts</a>
        <a href="#events" className="whitespace-nowrap hover:text-brand-text">Events</a>
        <a href="#impact" className="whitespace-nowrap hover:text-brand-text">Impact</a>
      </div>
    </header>
  );
}
