import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiArrowLeft,
  HiOutlineBell,
  HiOutlineSparkles,
  HiOutlineTruck,
} from "react-icons/hi2";
import {
  useMarkReportAsRead,
  useReportDetail,
} from "@/hooks/queries/useReport";
import ReportSectionRenderer from "@/components/controller/reportDetail/ReportSectionRenderer";
import {
  REPORT_RISK_BADGE_LABEL,
  REPORT_RISK_COLOR,
} from "@/constants/report.constants";

function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const [date, time = ""] = dateStr.split("T");
  return `${date} ${time.slice(0, 5)}`.trim();
}

const ACTION_ICON = {
  notifyCustomer: HiOutlineBell,
  dispatchEmergency: HiOutlineTruck,
};

export default function AiReportDetail() {
  const { id: reportId } = useParams();
  const navigate = useNavigate();
  const { data: report, isLoading, isError } = useReportDetail(reportId);
  const markAsRead = useMarkReportAsRead();
  const hasMarkedRef = useRef(false);

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
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sub-text)] transition hover:text-[var(--color-header-text)]"
      >
        <HiArrowLeft className="h-4 w-4" />
        보고서 목록
      </button>

      <article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-login-frame)] shadow-[0_12px_32px_rgba(15,61,46,0.08)]">
        <header className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold text-white ${REPORT_RISK_COLOR[report.riskLevel] ?? REPORT_RISK_COLOR.UNKNOWN}`}
            >
              {REPORT_RISK_BADGE_LABEL[report.riskLevel] ?? report.riskLevel}
            </span>
            {reportData?.isAiGenerated && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-main)] px-3 py-1 text-xs font-semibold text-[var(--color-sub-text)]">
                <HiOutlineSparkles className="h-3.5 w-3.5" />
                AI 자동 생성
              </span>
            )}
            {reportData?.llmEnhanced && (
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-sub-text)]">
                RAG·LLM 보강
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-header-text)] sm:text-3xl">
            {report.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-sub-text)]">
            {report.carNumber} · {report.carModel} · {formatDateTime(report.createdAt)}
          </p>
          {reportData?.period && (
            <p className="mt-1 text-xs text-[var(--color-btn-desc)]">
              보고 기간: {reportData.period.from} ~ {reportData.period.to}
            </p>
          )}
        </header>

        {!reportData ? (
          <div className="border-t border-[var(--color-border)] px-5 py-8 text-sm text-[var(--color-btn-desc)] sm:px-8">
            이 보고서는 아직 본문 내용이 없습니다.
          </div>
        ) : (
          <div className="px-5 pb-7 sm:px-8 sm:pb-9">
            {(reportData.sections ?? []).map((section, index) => (
              <ReportSectionRenderer
                key={`${section.type}-${section.title ?? section.heading ?? index}`}
                section={section}
              />
            ))}

            {reportData.sources?.length > 0 && (
              <section className="border-t border-[var(--color-border)] py-6">
                <h3 className="mb-3 text-base font-bold text-[var(--color-header-text)]">
                  참고 자료
                </h3>
                <ul className="flex list-none flex-col gap-2 p-0 text-sm text-[var(--color-sub-text)]">
                  {reportData.sources.map((source) => {
                    const location = [
                      source.page ? `${source.page}쪽` : null,
                      source.clause,
                    ]
                      .filter(Boolean)
                      .join(" · ");
                    const label = location
                      ? `${source.title} (${location})`
                      : source.title;
                    return (
                      <li
                        key={source.chunkId ?? label}
                        className="rounded-lg bg-[var(--color-bg-main)] px-3 py-2"
                      >
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline decoration-[var(--color-border)] underline-offset-4 hover:opacity-70"
                          >
                            {label}
                          </a>
                        ) : (
                          label
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {reportData.missingFields?.length > 0 && (
              <section className="border-t border-[var(--color-border)] py-5">
                <p className="text-xs leading-relaxed text-[var(--color-btn-desc)]">
                  데이터 확인 필요: {reportData.missingFields.join(", ")}
                </p>
              </section>
            )}

            {reportData.actions?.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-6">
                {reportData.actions.map((action) => {
                  const Icon = ACTION_ICON[action.key];
                  return (
                    <button
                      key={action.key}
                      type="button"
                      onClick={() => console.warn(`${action.key} action is not implemented`)}
                      className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-primary-btn)] px-4 py-2 text-sm font-semibold text-[var(--color-header-text)] shadow-sm transition hover:brightness-95"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
