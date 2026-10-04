import { DashboardData, DashboardStatus } from "./types";
import { differenceInHours } from "date-fns";

export function deriveStatus(data: Partial<DashboardData>): DashboardStatus {
  const reasons: string[] = [];
  
  if (!data.kp?.current || !data.scales?.data || !data.xray?.current) {
    return {
      level: "Unknown",
      reasons: ["Required data sources are unavailable."]
    };
  }

  const g = data.scales.data.g || 0;
  const s = data.scales.data.s || 0;
  const r = data.scales.data.r || 0;
  const kp = data.kp.current.kp;

  // Check for X/M class flares in last 24h
  let hasXClass = false;
  let hasMClass = false;
  if (data.xray?.data) {
    const now = new Date();
    for (const point of data.xray.data) {
      if (differenceInHours(now, new Date(point.time)) <= 24) {
        if (point.fluxWm2 >= 1e-4) hasXClass = true;
        else if (point.fluxWm2 >= 1e-5) hasMClass = true;
      }
    }
  }

  let level: "Quiet" | "Elevated" | "Storm" = "Quiet";

  if (g >= 1 || kp >= 5 || hasXClass || r >= 2 || s >= 2) {
    level = "Storm";
    if (g >= 1) reasons.push(`G${g} Geomagnetic Storm`);
    if (kp >= 5) reasons.push(`Kp index is ${kp.toFixed(2)}`);
    if (hasXClass) reasons.push(`X-class solar flare in last 24h`);
    if (r >= 2) reasons.push(`R${r} Radio Blackout`);
    if (s >= 2) reasons.push(`S${s} Solar Radiation Storm`);
  } else if (kp >= 4 || hasMClass || r === 1 || s === 1) {
    level = "Elevated";
    if (kp >= 4) reasons.push(`Kp index is ${kp.toFixed(2)} (Elevated)`);
    if (hasMClass) reasons.push(`M-class solar flare in last 24h`);
    if (r === 1) reasons.push(`R1 Minor Radio Blackout`);
    if (s === 1) reasons.push(`S1 Minor Solar Radiation Storm`);
  } else {
    reasons.push("All monitored parameters are at nominal levels.");
  }

  return { level, reasons };
}
