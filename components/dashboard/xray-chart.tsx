/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { XrayPoint, SourceMeta } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format } from "date-fns";

export function XrayChart({ data, meta }: { data?: XrayPoint[], meta?: SourceMeta }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 h-[300px] flex items-center justify-center">
        <span className="text-brand-muted">X-ray flux data unavailable</span>
      </div>
    );
  }

  const formatTime = (timeStr: string) => {
    return format(new Date(timeStr), "HH:mm");
  };

  const formatYAxis = (val: number) => {
    if (val === 1e-8) return "A";
    if (val === 1e-7) return "B";
    if (val === 1e-6) return "C";
    if (val === 1e-5) return "M";
    if (val === 1e-4) return "X";
    return "";
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[16px] font-semibold text-brand-text">GOES X-ray Flux</h3>
          <p className="text-[13px] text-brand-muted">Solar flare activity (0.1-0.8nm) over 24h</p>
        </div>
      </div>
      
      <div className="h-[220px] w-full" aria-label="Line chart showing GOES X-ray flux values">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              minTickGap={50}
              tick={{ fontSize: 11, fill: 'var(--color-brand-muted)' }}
              stroke="var(--color-brand-border)"
            />
            <YAxis 
              scale="log" 
              domain={[1e-9, 1e-3]} 
              ticks={[1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3]}
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12, fill: 'var(--color-brand-muted)', fontWeight: 'bold' }}
              stroke="var(--color-brand-border)"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-brand-panel-strong)', border: '1px solid var(--color-brand-border)', borderRadius: '8px', color: 'var(--color-brand-text)' }}
              labelFormatter={(label: any) => label ? format(new Date(label), "MMM dd, HH:mm 'UTC'") : ''}
              formatter={(value: any) => [Number(value).toExponential(2) + ' W/m²', 'Flux']}
            />
            <ReferenceLine y={1e-5} stroke="var(--color-brand-warning)" strokeDasharray="3 3" opacity={0.5} />
            <ReferenceLine y={1e-4} stroke="var(--color-brand-severe)" strokeDasharray="3 3" opacity={0.5} />
            <Line 
              type="monotone" 
              dataKey="fluxWm2" 
              stroke="var(--color-brand-amber)" 
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
