/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { KpPoint, SourceMeta } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { format } from "date-fns";

export function KpChart({ data, meta }: { data?: KpPoint[], meta?: SourceMeta }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 h-[300px] flex items-center justify-center">
        <span className="text-brand-muted">Kp index data unavailable</span>
      </div>
    );
  }

  const formatTime = (timeStr: string) => {
    return format(new Date(timeStr), "MM/dd HH:mm");
  };

  return (
    <div className="glass-panel p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[16px] font-semibold text-brand-text">Planetary Kp Index</h3>
          <p className="text-[13px] text-brand-muted">Geomagnetic activity over the last 3 days</p>
        </div>
        {meta?.status === "unavailable" && (
          <span className="text-[12px] text-brand-severe px-2 py-1 rounded bg-brand-severe/10">Data Unavailable</span>
        )}
      </div>
      
      <div className="h-[220px] w-full" aria-label="Bar chart showing planetary Kp index values over time">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              minTickGap={70}
              tick={{ fontSize: 11, fill: 'var(--color-brand-muted)' }}
              stroke="var(--color-brand-border)"
            />
            <YAxis 
              domain={[0, 9]} 
              ticks={[0, 3, 5, 7, 9]}
              tick={{ fontSize: 11, fill: 'var(--color-brand-muted)' }}
              stroke="var(--color-brand-border)"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-brand-panel-strong)', border: '1px solid var(--color-brand-border)', borderRadius: '8px', color: 'var(--color-brand-text)' }}
              labelFormatter={(label: any) => label ? format(new Date(label), "MMM dd, HH:mm 'UTC'") : ''}
              formatter={(value: any) => [`Kp ${Number(value).toFixed(2)}`, 'Geomagnetic Activity']}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <ReferenceLine y={5} stroke="var(--color-brand-severe)" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'G1 Storm', fill: 'var(--color-brand-severe)', fontSize: 11 }} />
            <Bar dataKey="kp" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => {
                const color = entry.kp >= 5 ? 'var(--color-brand-severe)' : entry.kp >= 4 ? 'var(--color-brand-warning)' : 'var(--color-brand-teal)';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
