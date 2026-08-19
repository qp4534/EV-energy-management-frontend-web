import ReportRow from "./ReportRow";
import LoadingIndicator from "@/components/common/LoadingIndicator";

export default function ReportList({
  reports,
  isLoading,
  showCarNumber = true,
}) {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (reports.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[var(--color-btn-desc)]">
        조건에 맞는 보고서가 없습니다.
      </p>
    );
  }

  return (
    <div>
      {reports.map((report) => (
        <ReportRow
          key={report.reportId}
          report={report}
          showCarNumber={showCarNumber}
        />
      ))}
    </div>
  );
}
