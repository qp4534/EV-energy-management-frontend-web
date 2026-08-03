import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const BORDER = "#e0e0e0";

export default function DonutStat({ title, data = [] }) {
  const isEmpty =
    data.length === 0 ||
    data.every((item) => item.value === 0);

  const chartData = isEmpty
    ? [
        {
          name: "데이터 없음",
          value: 1,
          color: BORDER,
        },
      ]
    : data;

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="relative h-[130px] w-[130px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={62}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-[15px] leading-relaxed font-semibold whitespace-nowrap text-[var(--color-sub-text)] [&>span]:text-[13px] [&>span]:leading-tight [&>span]:font-bold [&>span]:text-[var(--color-header-text)]">
          {Array.isArray(title) ? (
            title.map((text) => (
              <span key={text}>{text}</span>
            ))
          ) : (
            <span>{title}</span>
          )}
        </div>
      </div>

      <div className="mt-3 flex w-full flex-col gap-1">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-xs"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-sm"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span className="text-[var(--color-sub-text)]">
                {item.name}
              </span>
            </span>

            <span className="font-semibold text-[var(--color-header-text)]">
              {item.value}명
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
