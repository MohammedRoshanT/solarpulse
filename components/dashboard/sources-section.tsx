import { ExternalLink } from "lucide-react";

export function SourcesSection() {
  const sources = [
    {
      name: "NOAA SWPC",
      url: "https://www.swpc.noaa.gov/",
      description: "Space Weather Prediction Center. Primary source for Kp index, scales, GOES X-ray flux, solar wind, and alerts.",
      endpoints: [
        "/products/noaa-planetary-k-index.json",
        "/products/noaa-scales.json",
        "/json/goes/primary/xrays-1-day.json",
        "/json/rtsw/rtsw_wind_1m.json",
        "/json/rtsw/rtsw_mag_1m.json",
        "/products/alerts.json"
      ]
    },
    {
      name: "NASA CCMC DONKI",
      url: "https://ccmc.gsfc.nasa.gov/DONKI/",
      description: "Space weather database for CME, flare, and geomagnetic storm research data. Currently falling back to NOAA alerts.",
      endpoints: [
        "/DONKI-API/get/FLR (Unavailable in current environment)"
      ]
    }
  ];

  return (
    <div className="glass-panel p-6" id="sources">
      <h2 className="text-xl font-semibold text-brand-text mb-4">Data Sources & Architecture</h2>
      <p className="text-[14px] text-brand-muted mb-6 max-w-3xl leading-relaxed">
        This dashboard aggregates telemetry from official US government sources. 
        Data is fetched server-side, validated, normalized, and cached for 5 minutes to prevent rate-limiting 
        and ensure reliability even if an upstream API temporarily fails.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources.map((source, i) => (
          <div key={i} className="border border-brand-border/40 bg-brand-panel-strong rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-brand-text">{source.name}</h3>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:text-white transition-colors" aria-label={`Visit ${source.name}`}>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[13px] text-brand-muted mb-3">{source.description}</p>
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider mb-2">Verified Endpoints Used</div>
              {source.endpoints.map((ep, j) => (
                <div key={j} className="text-[11px] font-mono text-brand-muted/70 bg-black/30 px-2 py-1 rounded truncate">
                  {ep}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
