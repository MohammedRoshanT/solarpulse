/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { WindPoint, SourceMeta } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format } from "date-fns";

export function SolarWindChart({ data, meta }: { data?: WindPoint[], meta?: SourceMeta }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 h-[300px] flex items-center justify-center">
        <span className="text-brand-muted">Solar wind data unavailable</span>
      </div>
    );
  }

  const formatTime = (timeStr: string) => {
    return format(new Date(timeStr), "HH:mm");
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[16px] font-semibold text-brand-text">Solar Wind Speed</h3>
          <p className="text-[13px] text-brand-muted">Proton speed (km/s) at L1 point</p>
        </div>
      </div>
      
      <div className="h-[220px] w-full" aria-label="Line chart showing solar wind speed">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              minTickGap={50}
              tick={{ fontSize: 11, fill: 'var(--color-brand-muted)' }}
              stroke="var(--color-brand-border)"
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 11, fill: 'var(--color-brand-muted)' }}
              stroke="var(--color-brand-border)"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-brand-panel-strong)', border: '1px solid var(--color-brand-border)', borderRadius: '8px', color: 'var(--color-brand-text)' }}
              labelFormatter={(label: any) => label ? format(new Date(label), "MMM dd, HH:mm 'UTC'") : ''}
              formatter={(value: any) => [`${Number(value).toFixed(0)} km/s`, 'Speed']}
            />
            <ReferenceLine y={500} stroke="var(--color-brand-warning)" strokeDasharray="3 3" opacity={0.5} label={{ position: 'insideTopLeft', value: 'High Speed', fill: 'var(--color-brand-warning)', fontSize: 11, opacity: 0.8 }} />
            <Line 
              type="monotone" 
              dataKey="speedKms" 
              stroke="#A78BFA" 
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
