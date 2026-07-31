import "../../styles/administrator/components/LogTabs.css";

export const LOG_TABS = [
  { key: "login", label: "로그인 기록" },
  { key: "carChange", label: "차량 등록/변경" },
  { key: "userActivity", label: "이용자 활동" },
  { key: "adminAction", label: "관리자 작업" },
];

// 관리자 페이지 공용 세그먼트 탭 (로그 관리 / 통계 리포트 조회 등에서 재사용)
export default function LogTabs({ tabs = LOG_TABS, activeTab, onChange }) {
  return (
    <div className="log-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.key}
          className={`log-tabs__item ${
            activeTab === tab.key ? "log-tabs__item--active" : ""
          }`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
