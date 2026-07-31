import React from "react";

/**
 * @param {string} label
 * @param {React.ReactNode} value - 문자열 또는 dot 포함 JSX 등 자유롭게
 * @param {string} [unit] - value 뒤에 작게 붙는 단위 (예: "사이클", "만원")
 * @param {string} [caption] - 값 아래 작은 보조 텍스트
 */
export default function InfoBlock({ label, value, unit, caption }) {
  return (
    <div>
      <p className="mb-2 text-sm text-[var(--color-sub-text)]">{label}</p>
      <div className="text-2xl leading-tight font-bold text-[var(--color-header-text)]">
        {value}
        {unit && <span className="ml-1 text-base font-normal">{unit}</span>}
      </div>
      {caption && (
        <p className="mt-1 text-xs text-[var(--color-btn-desc)]">{caption}</p>
      )}
    </div>
  );
}
