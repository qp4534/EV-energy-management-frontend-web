import React from "react";

const TONE_DOT_CLASS = {
  success: "bg-[var(--color-primary-btn)]",
  // TODO: 아래 두 톤은 :root에 아직 전용 변수가 없어서 임시 hex입니다.
  // 나중에 --color-warning / --color-danger 같은 토큰으로 옮기는 걸 추천드려요.
  warning: "bg-[#e8b64a]",
  danger: "bg-[#e15b5b]",
  neutral: "bg-[var(--color-border)]",
};

const SIZE_CLASS = {
  sm: { dot: "h-2 w-2", label: "text-[0.9375rem]" },
  md: { dot: "h-2.5 w-2.5", label: "text-base" },
};

/**
 * @param {"success"|"warning"|"danger"|"neutral"} [tone] - 점 색상 톤 (기본 neutral)
 * @param {string} label - 점 옆에 표시할 텍스트
 * @param {"sm"|"md"} [size] - 점/텍스트 크기 (기본 md)
 */
export default function StatusDot({ tone = "neutral", label, size = "md" }) {
  const sizeClass = SIZE_CLASS[size] ?? SIZE_CLASS.md;

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`shrink-0 rounded-full ${sizeClass.dot} ${TONE_DOT_CLASS[tone] ?? TONE_DOT_CLASS.neutral}`}
      />
      <span className={`font-bold text-[var(--color-header-text)] ${sizeClass.label}`}>
        {label}
      </span>
    </span>
  );
}