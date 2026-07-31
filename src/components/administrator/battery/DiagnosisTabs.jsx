import React from "react";
import "../../../styles/administrator/BatteryDiagnosis.css";

const TABS = [
  { key: "diagnosis", label: "배터리 진단" },
  { key: "value", label: "배터리 잔존가치/판매처" },
  { key: "proposal", label: "배터리 매도 제안서" },
];

export default function DiagnosisTabs({ activeTab, onChange }) {
  return (
    <div className="battery-diagnosis-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`battery-diagnosis-tab ${
            tab.key === activeTab ? "active" : ""
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}