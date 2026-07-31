import { useState } from "react";
import { useParams } from "react-router-dom";
import ReportDateSearchBar from "@/components/controller/report/ReportDateSearchBar";
import ReportTypeFilterPanel from "@/components/controller/report/ReportTypeFilterPanel";
import ReportList from "@/components/controller/report/ReportList";
import Pagination from "@/components/common/Pagination";
import { useReportList } from "@/hooks/queries/useReport";
import {
  DEFAULT_CAR_REPORT_FILTERS,
  PAGE_SIZE,
} from "@/constants/report.constants";

export default function CarReportList() {
  const { id: carId } = useParams();

  const [dateRange, setDateRange] = useState({ dateFrom: "", dateTo: "" });
  const [filters, setFilters] = useState(DEFAULT_CAR_REPORT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // 날짜/필터가 바뀌면 1페이지로 리셋
  const handleDateSearch = (next) => {
    setDateRange(next);
    setCurrentPage(1);
  };
  const handleFiltersChange = (next) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const { data, isLoading, isError } = useReportList({
    carId,
    page: currentPage,
    pageSize: PAGE_SIZE,
    ...dateRange,
    ...filters,
  });

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-[var(--color-header-text)]">AI 보고서</h2>

      <ReportDateSearchBar
        dateFrom={dateRange.dateFrom}
        dateTo={dateRange.dateTo}
        onSearch={handleDateSearch}
      >
        {({ close }) => (
          <ReportTypeFilterPanel
            initialFilters={filters}
            onApply={(next) => {
              handleFiltersChange(next);
              close();
            }}
          />
        )}
      </ReportDateSearchBar>

      <div className="card">
        {isError ? (
          <p className="py-10 text-center text-sm text-red-500">
            목록을 불러오지 못했습니다.
          </p>
        ) : (
          <ReportList
            reports={data?.items ?? []}
            isLoading={isLoading}
            showCarNumber={false}
          />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
