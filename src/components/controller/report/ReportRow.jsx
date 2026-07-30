import { useNavigate } from "react-router-dom";

// 날짜 "YYYY-MM-DD" -> "YYYY.MM.DD." 형식으로 변환
function formatDate(dateStr) {
  return `${dateStr.replaceAll("-", ".")}.`;
}

export default function ReportRow({ report, showCarNumber = true }) {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/controller/reports/${report.reportId}`);

  return (
    <div
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetail();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${report.title} 상세 보기`}
      className="flex cursor-pointer items-center justify-between border-b border-[var(--color-border)] py-4 text-sm hover:bg-[var(--color-bg-main)] focus:outline focus:outline-2 focus:outline-[var(--color-primary-btn)]"
    >
      <div className="flex items-center gap-2">
        <span className="text-[var(--color-header-text)]">{report.title}</span>
        {!report.isRead && (
          <span className="rounded-full bg-[var(--color-header-text)] px-2 py-0.5 text-xs font-semibold text-white">
            NEW
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-[var(--color-header-text)]">
        {showCarNumber && (
          <>
            <span>{report.carNumber}</span>
            <span className="text-[var(--color-border)]">|</span>
          </>
        )}
        <span>{formatDate(report.createdAt)}</span>
      </div>
    </div>
  );
}
