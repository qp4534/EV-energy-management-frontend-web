import React from "react";

const RISK_COLOR_VAR = {
  normal: "var(--color-risk-normal)",
  caution: "var(--color-risk-caution)",
  warning: "var(--color-risk-warning)",
  emergency: "var(--color-risk-emergency)",
};

/**
 * 위험등급 1건을 보여주는 미니 카드. (예: 양호 / 보통 / 위험 / 긴급)
 * 하단의 얇은 바는 전체 차량 수 대비 해당 등급 비중을 시각화한다.
 *
 * @param {string} label - 등급명 (양호/보통/위험/긴급)
 * @param {number} count - 해당 등급 차량 수
 * @param {number} total - 전체 차량 수 (비중 계산용)
 * @param {"normal"|"caution"|"warning"|"emergency"} type - 색상 매핑 키
 */
export default function RiskLevelCard({ label, count = 0, total = 0, type }) {
  const color = RISK_COLOR_VAR[type] || "var(--color-risk-fallback)";
  const percent = total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0;

  return (
    <div className="mini-card flex flex-col items-center text-center">
      <span className="text-sm font-bold" style={{ color }}>
        {label}
      </span>

      <span className="mt-2 text-2xl font-extrabold text-[var(--color-header-text)]">
        {count.toLocaleString()}
      </span>

      <div className="mt-4 h-1.5 w-full rounded-full bg-[var(--color-border)]">
        <div
          className="h-1.5 rounded-full transition-[width]"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}