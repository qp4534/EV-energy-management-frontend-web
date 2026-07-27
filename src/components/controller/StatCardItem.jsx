import React from "react";

const COLOR_STYLES = {
  total: { bg: "#0A382C", text: "#FFFFFF" }, // 전체 차량 (어두운 딥그린)
  emergency: { bg: "#FF0000", text: "#FFFFFF" }, // 긴급 차량 (빨강)
  warning: { bg: "#FF8A00", text: "#FFFFFF" }, // 경고 차량 (주황)
  caution: { bg: "#FFD600", text: "#FFFFFF" }, // 주의 차량 (노랑)
  normal: { bg: "#B4E0A0", text: "#FFFFFF" }, // 정상 차량 (연두)
};

export default function StatCardItem({ title, count, type }) {
  const style = COLOR_STYLES[type] || { bg: "#4B5563", text: "#FFFFFF" };
  return (
    <div
      style={{ backgroundColor: style.bg, color: style.text }} // 👈 Hex 색상은 style 속성에 지정!
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
