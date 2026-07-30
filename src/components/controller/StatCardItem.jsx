import React from "react";

// index.css의 --color-risk-* 변수를 그대로 참조 (StatCardItem, CarList 테이블 위험도 스와치 공용)
const COLOR_STYLES = {
  total: { bg: "var(--color-risk-total)", text: "#FFFFFF" }, // 전체 차량 (어두운 딥그린)
  emergency: { bg: "var(--color-risk-emergency)", text: "#FFFFFF" }, // 긴급 차량 (빨강)
  warning: { bg: "var(--color-risk-warning)", text: "#FFFFFF" }, // 경고 차량 (주황)
  caution: { bg: "var(--color-risk-caution)", text: "#FFFFFF" }, // 주의 차량 (노랑)
  normal: { bg: "var(--color-risk-normal)", text: "#FFFFFF" }, // 정상 차량 (연두)
};

export default function StatCardItem({ title, count, type }) {
  const style = COLOR_STYLES[type] || {
    bg: "var(--color-risk-fallback)",
    text: "#FFFFFF",
  };
  return (
    <div
      style={{ backgroundColor: style.bg, color: style.text }} // 👈 CSS 변수는 style 속성에 지정!
      className="mini-card"
    >
      <span className="text-base text-[30px]">{title}</span>

      {/* 2. 하단 차량 수 수치 및 '대' 단위 */}
      <div className="text-right">
        <span className="text-[40px] font-extrabold tracking-tight">
          {count !== undefined && count !== null ? count.toLocaleString() : 0}
        </span>
        <span className="text-[30px] font-bold ml-1"> 대</span>
      </div>
    </div>
  );
}
