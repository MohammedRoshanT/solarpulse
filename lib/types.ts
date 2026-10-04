export type SourceStatus = "ok" | "stale" | "unavailable";

export interface SourceMeta {
  status: SourceStatus;
  fetchedAt: string;
  dataTime?: string;
  source: string;
  error?: string;
}

export interface KpPoint {
  time: string;
  kp: number;
  observed: boolean;
}

export interface XrayPoint {
  time: string;
  fluxWm2: number;
}

export interface Flare {
  begin?: string;
  max: string;
  end?: string;
  maxClass: string;
}

export interface WindPoint {
  time: string;
  speedKms?: number;
  densityCm3?: number;
}

export interface BzPoint {
  time: string;
  bzNt?: number;
  btNt?: number;
}

export interface Scales {
  g: number | null;
  s: number | null;
  r: number | null;
  asOf: string;
}

export interface SpaceEvent {
  id: string;
  time: string;
  kind: "alert" | "flare" | "cme" | "geomagnetic_storm";
  title: string;
  detail?: string;
  source: string;
  url?: string;
}

export interface DashboardData {
  generatedAt: string;
  kp: {
    meta: SourceMeta;
    data: KpPoint[];
    current?: KpPoint;
  };
  xray: {
    meta: SourceMeta;
    data: XrayPoint[];
    current?: XrayPoint;
  };
  wind: {
    meta: SourceMeta;
    data: WindPoint[];
    current?: WindPoint;
  };
  bz: {
    meta: SourceMeta;
    data: BzPoint[];
    current?: BzPoint;
  };
  scales: {
    meta: SourceMeta;
    data: Scales | null;
  };
  events: {
    meta: SourceMeta;
    data: SpaceEvent[];
  };
  status: DashboardStatus;
}

export interface DashboardStatus {
  level: "Quiet" | "Elevated" | "Storm" | "Unknown";
  reasons: string[];
}
