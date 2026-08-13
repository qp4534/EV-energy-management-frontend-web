const RISK_LABEL = {
  EMERGENCY: "긴급",
  WARNING: "경고",
  CAUTION: "주의",
  NORMAL: "정상",
  UNKNOWN: "미확인",
};

// 초 단위, "KST" 표기는 카드에 담기엔 불필요한 정보라 분/날짜까지만 보여준다
// (AiReportDetail.jsx 상단의 날짜 표시와 같은 형식으로 맞춤).
function formatKst(value) {
  if (typeof value !== "string" || !value.includes("T")) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")} ${part("hour")}:${part("minute")}`;
}

function displayValue(item) {
  const label = String(item.label ?? "");
  if (label.includes("시각")) return formatKst(item.value);
  if (label.includes("위험등급") && typeof item.value === "string") {
    return RISK_LABEL[item.value.toUpperCase()] ?? item.value;
  }
  return item.value;
}

export default function MetricGridSection({ section }) {
  return (
    <section className="border-t border-[var(--color-border)] py-6">
      <h3 className="mb-4 text-lg font-bold text-[var(--color-header-text)]">
        {section.title ?? section.heading}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(section.items ?? []).map((item) => {
          const isDanger = item.emphasis === "danger";
          return (
            <div
              key={item.label}
              className={
                isDanger
                  ? "rounded-xl border border-red-200 bg-red-50 p-4 shadow-[0_3px_10px_rgba(220,38,38,0.08)]"
                  : "rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-[0_3px_10px_rgba(15,61,46,0.07)]"
              }
            >
              <div className="text-xs font-semibold text-[var(--color-sub-text)]">
                {item.label}
              </div>
              <div
                className={
                  isDanger
                    ? "mt-1 text-3xl font-extrabold text-red-600"
                    : "mt-1 text-3xl font-extrabold text-[var(--color-header-text)]"
                }
              >
                {displayValue(item)}
                {item.unit && (
                  <span className="ml-0.5 text-lg font-bold">{item.unit}</span>
                )}
              </div>
              {item.caption && (
                <div className="mt-1 text-xs text-[var(--color-btn-desc)]">
                  {item.caption}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
