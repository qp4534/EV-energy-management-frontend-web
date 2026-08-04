import React from "react";
import "../../../styles/administrator/SystemPage.css";

/**
 * @param {boolean} checked
 * @param {(next: boolean) => void} onChange
 */
export default function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={`toggle-switch ${checked ? "on" : ""}`}
      onClick={() => onChange?.(!checked)}
    >
      <span className="toggle-switch-knob" />
    </button>
  );
}
