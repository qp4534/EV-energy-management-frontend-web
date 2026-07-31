import React from "react";

/**
 * @param {string[]} items
 */
export default function BulletList({ items }) {
  return (
    <ul className="m-0 list-none p-0">
      {items.map((item, idx) => (
        <li
          key={idx}
          className="relative mb-2 pl-3.5 text-sm leading-relaxed text-[var(--color-sub-text)] last:mb-0 before:absolute before:left-0 before:content-['•'] before:text-[var(--color-btn-desc)]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
