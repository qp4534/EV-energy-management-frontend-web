import React from "react";

/**
 * 관리자 페이지 공용 알약(pill) 스타일 탭 그룹.
 * 로그 관리 / 배터리 진단 / 통계 리포트 등에서 재사용.
 *
 * @param {{key:string, label:string}[]} tabs
 * @param {string} activeTab
 * @param {(key:string) => void} onChange
 */
export default function TabBar({ tabs, activeTab, onChange }) {
  return (
    <div
      role="tablist"
      className="mb-6 inline-flex self-start items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-login-frame)] p-1"
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={tab.key === activeTab}
          onClick={() => onChange(tab.key)}
          className={`rounded-full border-none px-5 py-2 text-sm font-medium transition-colors ${
            tab.key === activeTab
              ? "bg-[var(--color-primary-btn)] text-[var(--color-header-text)]"
              : "bg-transparent text-[var(--color-sub-text)] hover:text-[var(--color-header-text)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}