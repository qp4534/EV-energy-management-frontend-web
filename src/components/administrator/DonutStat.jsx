// src/components/dashboard/DonutStat.jsx

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "../../styles/administrator/components/DonutStat.css";

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
    <div className="donut-stat">
      <div className="donut-chart-wrap">
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

        <div className="donut-center-label">
          {Array.isArray(title) ? (
            title.map((text) => (
              <span key={text}>{text}</span>
            ))
          ) : (
            <span>{title}</span>
          )}
        </div>
      </div>

      <div className="donut-legend">
        {data.map((item) => (
          <div
            key={item.name}
            className="donut-legend-item"
          >
            <span className="legend-left">
              <span
                className="legend-dot"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span className="legend-name">
                {item.name}
              </span>
            </span>

            <span className="legend-value">
              {item.value}명
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}