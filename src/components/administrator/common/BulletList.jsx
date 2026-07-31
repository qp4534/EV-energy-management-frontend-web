import React from "react";
import "../../../styles/administrator/components/BulletList.css";

/**
 * @param {string[]} items
 */
export default function BulletList({ items }) {
  return (
    <ul className="bullet-list">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
}