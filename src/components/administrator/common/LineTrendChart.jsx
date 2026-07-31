import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const BORDER = "#e0e0e0";
const MUTED = "#6c757d";

/**
 * 단일 지표의 추이를 보여주는 꺾은선 그래프. (예: 월별 가입자 추이)
 *
 * @param {object[]} data - [{ [xKey]: string, [dataKey]: number }, ...]
 * @param {string} dataKey - y값 필드명
 * @param {string} [xKey] - x값(보통 월) 필드명 (기본 "month")
 * @param {string} [color] - 선 색상
 * @param {string} [unit] - 툴팁에 붙는 단위 (예: "명")
 */
export default function LineTrendChart({
  data,
  dataKey,
  xKey = "month",
  color = "var(--color-header-text)",
  unit = "",
}) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={BORDER} vertical={false} />

          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={{ stroke: BORDER }}
            tick={{ fill: MUTED, fontSize: 12 }}
          />

          <YAxis
            tickLine={false}
            axisLine={{ stroke: BORDER }}
            tick={{ fill: MUTED, fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${BORDER}`,
              fontSize: 12,
            }}
            formatter={(value) => [unit ? `${value}${unit}` : value, dataKey]}
          />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
