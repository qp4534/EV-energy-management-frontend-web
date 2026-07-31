import React from "react";

/**
 * @param {number} rank - 1,2,3위
 * @param {string} [firstLabel]
 */
export default function RankBadge({ rank, firstLabel = "최고 제안가" }) {
  const label = rank === 1 ? firstLabel : `${rank}위`;
  return (
    <span className="inline-block rounded-full bg-[var(--color-primary-btn)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-header-text)]">
      {label}
    </span>
  );
}
