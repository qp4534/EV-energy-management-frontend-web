import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { HiOutlineBell, HiOutlineTruck } from "react-icons/hi2";
import {
  useReportDetail,
  useMarkReportAsRead,
} from "@/hooks/queries/useReport"; // 실제 프로젝트에서는 "@/hooks/queries/useReport"
import ReportSectionRenderer from "@/components/controller/reportDetail/ReportSectionRenderer";
import { REPORT_RISK_BADGE_LABEL } from "@/constants/report.constants";
import { RISK_LEVEL_COLOR } from "@/constants/carList.constants";

// "YYYY-MM-DDTHH:mm:ss" -> "YYYY-MM-DD HH:mm"
function formatDateTime(dateStr) {
  const [date, time = ""] = dateStr.split("T");
  return `${date} ${time.slice(0, 5)}`.trim();
}

// action.key -> 아이콘 매핑. 스키마엔 라벨/키만 있고 아이콘은 프론트에서 결정한다.
const ACTION_ICON = {
  notifyCustomer: HiOutlineBell,
  dispatchEmergency: HiOutlineTruck,
};

export default function AiReportDetail() {
  // 라우트가 "/controller/reports/:id"로 정의돼 있어서 파라미터 이름이 id다 (reportId 아님)
  const { id: reportId } = useParams();
  const { data: report, isLoading, isError } = useReportDetail(reportId);
  const markAsRead = useMarkReportAsRead();
  const hasMarkedRef = useRef(false);

  // 보고서를 불러온 뒤, 아직 안 읽은 상태(isRead: false)면 1회만 읽음 처리 요청을 보낸다.
  useEffect(() => {
    if (report && !report.isRead && !hasMarkedRef.current) {
      hasMarkedRef.current = true;
      markAsRead.mutate(reportId);
    }
  }, [report, reportId, markAsRead]);

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-[var(--color-btn-desc)]">불러오는 중...</p>
    );
  }

  if (isError || !report) {
    return (
      <p className="p-6 text-sm text-red-500">보고서를 찾을 수 없습니다.</p>
    );
  }

  const reportData = report.reportData;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold text-white ${RISK_LEVEL_COLOR[report.riskLevel]}`}
          >
            {REPORT_RISK_BADGE_LABEL[report.riskLevel] ?? report.riskLevel}
          </span>
          {reportData?.isAiGenerated && (
            <span className="rounded-full bg-[var(--color-bg-main)] px-3 py-1 text-xs font-semibold text-[var(--color-sub-text)]">
              AI 자동 생성
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-header-text)]">
          {report.title}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-sub-text)]">
          {report.carNumber} · {report.carModel} ·{" "}
          {formatDateTime(report.createdAt)}
        </p>
      </div>

      {!reportData ? (
        <div className="card text-sm text-[var(--color-btn-desc)]">
          이 보고서는 아직 본문 내용이 없습니다.
        </div>
      ) : (
        <>
          {reportData.sections.map((section, i) => (
            <ReportSectionRenderer key={i} section={section} />
          ))}

          {reportData.actions?.length > 0 && (
            <div className="flex items-center gap-3">
              {reportData.actions.map((action) => {
                const Icon = ACTION_ICON[action.key];
                return (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => console.warn(`${action.key} 액션 미연동`)}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary-btn)] px-4 py-2 text-sm font-semibold text-[var(--color-header-text)] hover:opacity-90"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
