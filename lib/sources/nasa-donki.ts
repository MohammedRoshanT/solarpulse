import { SpaceEvent, SourceMeta } from "../types";

// NASA DONKI API was verified to be unavailable/timeout during the environment check phase.
// Keeping it marked as unavailable to not crash the dashboard, and letting NOAA populate events.

export async function getDonkiEvents(): Promise<{ meta: SourceMeta; data: SpaceEvent[] }> {
  return {
    meta: {
      source: "NASA DONKI",
      fetchedAt: new Date().toISOString(),
      status: "unavailable",
      error: "NASA DONKI API is currently unreachable.",
    },
    data: [],
  };
}
