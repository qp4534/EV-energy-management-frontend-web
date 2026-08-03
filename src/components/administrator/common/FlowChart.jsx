// src/components/dashboard/FlowChart.jsx
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BORDER = "#e0e0e0";
const MUTED = "#6c757d";

export default function FlowChart({ data, seriesA, seriesB, colorA, colorB }) {
  return (
    <div className="flex flex-1 flex-col">
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`grad-${seriesA}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorA} stopOpacity={0.35} />
              <stop offset="100%" stopColor={colorA} stopOpacity={0} />
            </linearGradient>

            <linearGradient id={`grad-${seriesB}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorB} stopOpacity={0.35} />
              <stop offset="100%" stopColor={colorB} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={BORDER}
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: MUTED }}
            axisLine={false}
            tickLine={false}
            interval={0}
            padding={{ left: 8, right: 8 }}
          />

          <YAxis
            tick={{ fontSize: 10, fill: MUTED }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${BORDER}`,
              fontSize: 12,
            }}
          />

          <Area
            type="monotone"
            dataKey={seriesA}
            stroke={colorA}
            strokeWidth={2}
            fill={`url(#grad-${seriesA})`}
            dot={{ r: 2.5, fill: colorA, strokeWidth: 0 }}
          />

          <Area
            type="monotone"
            dataKey={seriesB}
            stroke={colorB}
            strokeWidth={2}
            fill={`url(#grad-${seriesB})`}
            dot={{ r: 2.5, fill: colorB, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-1 flex items-center justify-center gap-5">
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-sub-text)]">
          <span className="inline-block h-[7px] w-[7px] rounded-full" style={{ backgroundColor: colorA }} />
          {seriesA}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-sub-text)]">
          <span className="inline-block h-[7px] w-[7px] rounded-full" style={{ backgroundColor: colorB }} />
          {seriesB}
        </div>
      </div>
    </div>
  );
}
