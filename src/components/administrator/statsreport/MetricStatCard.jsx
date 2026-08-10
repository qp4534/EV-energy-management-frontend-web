import React from "react";

/**
 * 진단 지표 평균 1건을 보여주는 미니 카드. (예: 잔존수명/방전출력/충전건강도/전압안정성 평균)
 * RiskLevelCard와 같은 톤(둥근 카드 + 하단 진행바)이지만, 위험도 색상 체계에 묶이지 않고
 * 임의 색상을 그대로 받아서 쓰는 범용 버전.
 *
 * @param {string} label - 지표명
 * @param {number} value - 평균 점수
 * @param {string} unit - 단위 (기본 "점")
 * @param {number} max - 진행바 계산 기준 최댓값 (기본 100점 만점)
 * @param {string} color - CSS 색상값
 */
export default function MetricStatCard({ label, value = 0, unit = "점", max = 100, color }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className="mini-card flex flex-col items-center text-center">
      <span className="text-sm font-bold" style={{ color }}>
        {label}
      </span>

      <span className="mt-2 text-2xl font-extrabold text-[var(--color-header-text)]">
        {value}
        <span className="ml-1 text-base font-normal">{unit}</span>
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