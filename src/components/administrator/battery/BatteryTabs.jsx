/**
 * 배터리 진단 / 잔존가치·판매처 / 매도 제안서 3개 탭
 *
 * @param {"diagnosis"|"value"|"proposal"} activeTab
 * @param {(tab: string) => void} onChange - 라우팅은 상위(페이지)에서 처리 (예: navigate())
 */
export const BATTERY_TABS = [
  { key: "diagnosis", label: "배터리 진단" },
  { key: "value", label: "배터리 잔존가치/판매처" },
  { key: "proposal", label: "배터리 매도 제안서" },
];

export default function BatteryTabs({ activeTab, onChange }) {
  return (
    <div className="battery-tabs" role="tablist">
      {BATTERY_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.key}
          className={`battery-tabs__item ${
            activeTab === tab.key ? "battery-tabs__item--active" : ""
          }`}
          onClick={() => onChange?.(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
