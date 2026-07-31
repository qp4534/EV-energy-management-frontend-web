import React from "react";
import "../../../styles/administrator/components/RankBadge.css";

/**
 * @param {number} rank - 1,2,3위
 * @param {string} [firstLabel]
 */
export default function RankBadge({ rank, firstLabel = "최고 제안가" }) {
  const label = rank === 1 ? firstLabel : `${rank}위`;
  return <span className="rank-badge">{label}</span>;
}