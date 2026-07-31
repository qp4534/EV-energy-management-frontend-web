import React from "react";

// options = [] 기본값을 지정하여 undefined 방지
export default function UserFilterTab({ options = [], value, onChange }) {
  return (
    <div className="filter-tabs">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange && onChange(opt)}
          className={`filter-tab ${opt === value ? "active" : ""}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}