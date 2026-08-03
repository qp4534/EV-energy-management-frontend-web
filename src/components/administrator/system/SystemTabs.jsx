import React from "react";
import "../../../styles/administrator/SystemPage.css";

const TABS = [
  { key: "alertChannel", label: "알림 채널" },
  { key: "externalLink", label: "외부 연동" },
  { key: "batchJob", label: "배치 작업" },
  { key: "status", label: "시스템 상태" },
  { key: "backup", label: "백업 관리" },
];

export default function SystemTabs({ activeTab, onChange }) {
  return (
    <div className="system-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`system-tab ${tab.key === activeTab ? "active" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
