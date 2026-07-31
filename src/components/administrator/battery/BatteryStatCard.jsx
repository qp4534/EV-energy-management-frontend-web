import React from "react";
import StatCard from "../main/StatCard";

/**
 * 배터리 진단/잔존가치 요약에 쓰이는 통계 카드.
 * 기존 GradeStatCard / RemainingCycleStatCard / HealthScoreStatCard / BestOfferStatCard 를
 * 하나로 통합한 컴포넌트입니다. (값 구성 방식만 다르고 구조가 동일해 병합했습니다)
 *
 * @param {string} label - 카드 라벨 (예: "판별 등급", "예측 잔여수명")
 * @param {string|number} value - 메인 값. 숫자면 자동으로 천 단위 콤마(toLocaleString)가 적용됩니다.
 * @param {string} [unit] - 값 뒤에 작게 붙는 단위 (예: "사이클", "만원")
 * @param {string} [suffix] - 값 뒤에 그대로 붙는 문자열 (예: "%")
 * @param {string} [sub] - 값 아래 보조 캡션 (예: "(추정)", "(신품 500)")
 * @param {boolean} [showDot] - 값 앞에 색상 점 표시 여부 (판별 등급 카드용)
 */
export default function BatteryStatCard({
  label,
  value,
  unit,
  suffix,
  sub,
  showDot,
}) {
  const displayValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <StatCard
      label={label}
      value={
        <span>
          {showDot ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary-btn)",
                  display: "inline-block",
                }}
              />
              {displayValue}
            </span>
          ) : (
            <>
              {displayValue}
              {suffix}
              {unit && (
                <span style={{ fontSize: "1rem", fontWeight: 400, marginLeft: 4 }}>
                  {unit}
                </span>
              )}
            </>
          )}
          {sub && (
            <span
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 400,
                color: "var(--color-btn-desc)",
                marginTop: 4,
              }}
            >
              {sub}
            </span>
          )}
        </span>
      }
    />
  );
}
