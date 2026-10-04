import { NextResponse } from "next/server";
import { getKpIndex, getScales, getXrayFlux, getSolarWind, getMag, getAlerts } from "@/lib/sources/noaa";
import { getDonkiEvents } from "@/lib/sources/nasa-donki";
import { deriveStatus } from "@/lib/status";
import { DashboardData } from "@/lib/types";

export const revalidate = 300; // 5 minutes

export async function GET() {
  const [
    kpResult,
    scalesResult,
    xrayResult,
    windResult,
    magResult,
    alertsResult,
    donkiResult,
  ] = await Promise.allSettled([
    getKpIndex(),
    getScales(),
    getXrayFlux(),
    getSolarWind(),
    getMag(),
    getAlerts(),
    getDonkiEvents(),
  ]);

  const kp = kpResult.status === "fulfilled" ? kpResult.value : { meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable" as const }, data: [] };
  const scales = scalesResult.status === "fulfilled" ? scalesResult.value : { meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable" as const }, data: null };
  const xray = xrayResult.status === "fulfilled" ? xrayResult.value : { meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable" as const }, data: [] };
  const wind = windResult.status === "fulfilled" ? windResult.value : { meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable" as const }, data: [] };
  const bz = magResult.status === "fulfilled" ? magResult.value : { meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable" as const }, data: [] };
  
  const alertsData = alertsResult.status === "fulfilled" ? alertsResult.value.data : [];
  const donkiData = donkiResult.status === "fulfilled" ? donkiResult.value.data : [];
  
  // Combine and sort events
  const combinedEvents = [...alertsData, ...donkiData].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const data: Partial<DashboardData> = {
    generatedAt: new Date().toISOString(),
    kp,
    xray,
    wind,
    bz,
    scales,
    events: {
      meta: {
        source: "NOAA SWPC & NASA DONKI",
        fetchedAt: new Date().toISOString(),
        status: alertsResult.status === "fulfilled" || donkiResult.status === "fulfilled" ? "ok" : "unavailable",
      },
      data: combinedEvents.slice(0, 50),
    },
  };

  const status = deriveStatus(data);

  return NextResponse.json({ ...data, status });
}
