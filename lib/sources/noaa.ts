/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  KpPoint,
  XrayPoint,
  WindPoint,
  BzPoint,
  Scales,
  SpaceEvent,
  SourceMeta,
  SourceStatus,
} from "../types";
import { differenceInMinutes } from "date-fns";

const BASE_URL = "https://services.swpc.noaa.gov";

async function fetchJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      signal: controller.signal,
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

function getStatus(dataTimeStr: string | undefined, maxAgeMins: number): SourceStatus {
  if (!dataTimeStr) return "unavailable";
  const age = differenceInMinutes(new Date(), new Date(dataTimeStr + "Z")); // Assuming UTC
  if (age > maxAgeMins) return "stale";
  return "ok";
}

// 1. Kp Index
export async function getKpIndex(): Promise<{ meta: SourceMeta; data: KpPoint[]; current?: KpPoint }> {
  try {
    const raw = await fetchJson<any[]>("/products/noaa-planetary-k-index.json");
    const valid = raw.filter(row => row.time_tag);
    const data: KpPoint[] = valid.map((row) => ({
      time: row.time_tag + "Z",
      kp: parseFloat(row.Kp),
      observed: true,
    }));
    const current = data[data.length - 1];
    return {
      meta: {
        source: "NOAA SWPC",
        fetchedAt: new Date().toISOString(),
        status: getStatus(current?.time, 6 * 60), // 6 hours
        dataTime: current?.time,
      },
      data,
      current,
    };
  } catch (error) {
    return {
      meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable", error: String(error) },
      data: [],
    };
  }
}

// 2. Scales
export async function getScales(): Promise<{ meta: SourceMeta; data: Scales | null }> {
  try {
    const raw = await fetchJson<any>("/products/noaa-scales.json");
    // Format: { "0": { DateStamp, TimeStamp, G, S, R }, "1": ... } "0" is current day.
    const currentDay = raw["0"] || raw["-1"]; // Fallback to previous day if "0" is empty? Actually "0" is usually present.
    if (!currentDay) throw new Error("No scales data");
    const asOf = currentDay.DateStamp + "T" + currentDay.TimeStamp + "Z";
    const data: Scales = {
      g: parseInt(currentDay.G?.Scale) || 0,
      s: parseInt(currentDay.S?.Scale) || 0,
      r: parseInt(currentDay.R?.Scale) || 0,
      asOf,
    };
    return {
      meta: {
        source: "NOAA SWPC",
        fetchedAt: new Date().toISOString(),
        status: getStatus(asOf, 6 * 60),
        dataTime: asOf,
      },
      data,
    };
  } catch (error) {
    return {
      meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable", error: String(error) },
      data: null,
    };
  }
}

// 3. X-ray Flux
export async function getXrayFlux(): Promise<{ meta: SourceMeta; data: XrayPoint[]; current?: XrayPoint }> {
  try {
    const raw = await fetchJson<any[]>("/json/goes/primary/xrays-1-day.json");
    // Filter to long channel 0.1-0.8nm
    const filtered = raw.filter((d) => d.energy === "0.1-0.8nm");
    
    // Downsample to ~5 min to avoid huge payloads.
    const data: XrayPoint[] = [];
    for (let i = 0; i < filtered.length; i += 5) {
      data.push({
        time: filtered[i].time_tag,
        fluxWm2: filtered[i].flux,
      });
    }
    const current = filtered.length > 0 ? {
      time: filtered[filtered.length - 1].time_tag,
      fluxWm2: filtered[filtered.length - 1].flux,
    } : undefined;

    return {
      meta: {
        source: "NOAA SWPC",
        fetchedAt: new Date().toISOString(),
        status: getStatus(current?.time, 30),
        dataTime: current?.time,
      },
      data,
      current,
    };
  } catch (error) {
    return {
      meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable", error: String(error) },
      data: [],
    };
  }
}

// 4. Solar Wind
export async function getSolarWind(): Promise<{ meta: SourceMeta; data: WindPoint[]; current?: WindPoint }> {
  try {
    const raw = await fetchJson<any[]>("/json/rtsw/rtsw_wind_1m.json");
    // Take last ~720 points (12 hours) if we want, or just return them all.
    // Let's just return what's there but filter nulls.
    const valid = raw.filter(d => d.proton_speed !== null);
    
    const data: WindPoint[] = valid.map(d => ({
      time: d.time_tag + "Z",
      speedKms: d.proton_speed,
      densityCm3: d.proton_density,
    }));
    const current = data[data.length - 1];

    return {
      meta: {
        source: "NOAA SWPC",
        fetchedAt: new Date().toISOString(),
        status: getStatus(current?.time, 30),
        dataTime: current?.time,
      },
      data,
      current,
    };
  } catch (error) {
    return {
      meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable", error: String(error) },
      data: [],
    };
  }
}

// 5. Bz (Mag)
export async function getMag(): Promise<{ meta: SourceMeta; data: BzPoint[]; current?: BzPoint }> {
  try {
    const raw = await fetchJson<any[]>("/json/rtsw/rtsw_mag_1m.json");
    const valid = raw.filter(d => d.bz_gsm !== null);
    
    const data: BzPoint[] = valid.map(d => ({
      time: d.time_tag + "Z",
      bzNt: d.bz_gsm,
      btNt: d.bt,
    }));
    const current = data[data.length - 1];

    return {
      meta: {
        source: "NOAA SWPC",
        fetchedAt: new Date().toISOString(),
        status: getStatus(current?.time, 30),
        dataTime: current?.time,
      },
      data,
      current,
    };
  } catch (error) {
    return {
      meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable", error: String(error) },
      data: [],
    };
  }
}

// 6. Alerts
export async function getAlerts(): Promise<{ meta: SourceMeta; data: SpaceEvent[] }> {
  try {
    const raw = await fetchJson<any[]>("/products/alerts.json");
    const data: SpaceEvent[] = raw.map((d: any, i: number) => {
      // parse message for title
      const lines = d.message.split("\n");
      const titleLine = lines.find((l: string) => l.startsWith("WARNING:") || l.startsWith("WATCH:") || l.startsWith("ALERT:") || l.startsWith("SUMMARY:"));
      const title = titleLine || "Space Weather Alert";
      let kind: SpaceEvent["kind"] = "alert";
      
      const tl = title.toLowerCase();
      if (tl.includes("x-ray") || tl.includes("flare")) kind = "flare";
      else if (tl.includes("geomagnetic")) kind = "geomagnetic_storm";
      else if (tl.includes("coronal mass ejection")) kind = "cme";

      return {
        id: `alert-${d.issue_datetime}-${i}`,
        time: d.issue_datetime.replace(" ", "T") + "Z",
        kind,
        title,
        detail: d.message.substring(0, 200).replace(/\n/g, " ") + (d.message.length > 200 ? "..." : ""),
        source: "NOAA SWPC",
      };
    });

    return {
      meta: {
        source: "NOAA SWPC",
        fetchedAt: new Date().toISOString(),
        status: "ok",
        dataTime: data[0]?.time,
      },
      data,
    };
  } catch (error) {
    return {
      meta: { source: "NOAA SWPC", fetchedAt: new Date().toISOString(), status: "unavailable", error: String(error) },
      data: [],
    };
  }
}
