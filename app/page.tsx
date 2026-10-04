"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/dashboard/header";
import { StatusCard } from "@/components/dashboard/status-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { KpChart } from "@/components/dashboard/kp-chart";
import { XrayChart } from "@/components/dashboard/xray-chart";
import { SolarWindChart } from "@/components/dashboard/solar-wind-chart";
import { SDOImage } from "@/components/dashboard/sdo-image";
import { EventTimeline } from "@/components/dashboard/event-timeline";
import { ImpactSection } from "@/components/dashboard/impact-section";
import { SourcesSection } from "@/components/dashboard/sources-section";
import { DashboardData } from "@/lib/types";

export default function Dashboard() {
  const [data, setData] = useState<Partial<DashboardData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState<number>(Date.now());

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setRefreshTimestamp(Date.now());
    try {
      const res = await fetch("/api/space-weather");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    const interval = setInterval(() => {
      fetchData(true);
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-brand-muted font-mono text-[14px]">Initializing SolarPulse telemetry...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-6 text-center max-w-md">
          <div className="text-brand-severe mb-2">System Error</div>
          <p className="text-brand-muted text-[14px]">{error}</p>
          <button onClick={() => fetchData(true)} className="mt-4 px-4 py-2 bg-brand-panel hover:bg-white/5 border border-brand-border rounded text-[13px] transition-colors">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Derive X-ray flare class for the metric card
  let xrayClass = "A-Class";
  if (data?.xray?.current) {
    const f = data.xray.current.fluxWm2;
    if (f >= 1e-4) xrayClass = "X-Class";
    else if (f >= 1e-5) xrayClass = "M-Class";
    else if (f >= 1e-6) xrayClass = "C-Class";
    else if (f >= 1e-7) xrayClass = "B-Class";
  }

  return (
    <>
      <Header generatedAt={data?.generatedAt} onRefresh={() => fetchData(true)} isRefreshing={refreshing} />
      
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8 md:space-y-12">
        
        {/* OVERVIEW SECTION */}
        <section id="overview" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-5 h-full">
              <StatusCard status={data?.status} scales={data?.scales?.data} />
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 min-[380px]:grid-cols-2 gap-4 lg:gap-6 min-w-0">
              <MetricCard 
                label="Geomagnetic Kp" 
                value={data?.kp?.current?.kp?.toFixed(2) || "--"} 
                meaning="Global planetary disturbance index."
                meta={data?.kp?.meta}
                tooltipText="A measure of disruptions to Earth's magnetic field. Values >= 5 indicate a geomagnetic storm."
                accentType="teal"
              />
              <MetricCard 
                label="Solar Flare" 
                value={xrayClass} 
                meaning={`Current flux: ${data?.xray?.current?.fluxWm2?.toExponential(2) || "--"} W/m²`}
                meta={data?.xray?.meta}
                tooltipText="Current classification based on GOES X-ray flux. M and X class flares can cause radio blackouts."
                accentType="amber"
              />
              <MetricCard 
                label="Solar Wind" 
                value={data?.wind?.current?.speedKms?.toFixed(0) || "--"}
                unit="km/s" 
                meaning={data?.wind?.current?.densityCm3 ? `Density: ${data.wind.current.densityCm3.toFixed(1)} p/cm³` : "Speed of charged particles from the Sun."}
                meta={data?.wind?.meta}
                tooltipText="Speeds > 500 km/s can trigger geomagnetic storms if the magnetic field is oriented southward."
                accentType="cyan"
              />
              <MetricCard 
                label="IMF Bz" 
                value={data?.bz?.current?.bzNt?.toFixed(1) || "--"}
                unit="nT" 
                meaning={Number(data?.bz?.current?.bzNt) < 0 ? "Southward (increases storm risk)" : "Northward (protective)"}
                meta={data?.bz?.meta}
                tooltipText="Z-component of the Interplanetary Magnetic Field. Negative (southward) values allow solar wind to transfer energy to Earth."
                accentType="blue"
              />
            </div>
          </div>
        </section>

        {/* CHARTS SECTION */}
        <section id="charts" className="scroll-mt-24 space-y-6">
          <h2 className="text-xl font-semibold text-brand-text px-2">Telemetry</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <KpChart data={data?.kp?.data} meta={data?.kp?.meta} />
              </div>
              <div className="lg:col-span-4">
                <SDOImage timestamp={refreshTimestamp} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
              <XrayChart data={data?.xray?.data} meta={data?.xray?.meta} />
              <SolarWindChart data={data?.wind?.data} meta={data?.wind?.meta} />
            </div>
          </div>
        </section>

        {/* EVENTS SECTION */}
        <section>
          <EventTimeline events={data?.events?.data} meta={data?.events?.meta} />
        </section>

        {/* IMPACT SECTION */}
        <section>
          <ImpactSection scales={data?.scales?.data} />
        </section>

        {/* SOURCES SECTION */}
        <section>
          <SourcesSection />
        </section>

      </main>

      <footer className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 text-center text-[12px] text-brand-muted/70 border-t border-brand-border/30 mt-12">
        <p>Educational visualization using publicly available NASA and NOAA space-weather data.</p>
        <p className="mt-1">Not an official forecast or warning service. Not affiliated with NASA or NOAA.</p>
      </footer>
    </>
  );
}
