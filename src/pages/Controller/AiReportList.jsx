import { useState } from "react";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import ReportFilterPanel from "@/components/controller/report/ReportFilterPanel";
import ReportList from "@/components/controller/report/ReportList";
import Pagination from "@/components/common/Pagination";
import { useReportList } from "@/hooks/queries/useReport";
import {
  DEFAULT_REPORT_FILTERS,
  PAGE_SIZE,
} from "@/constants/report.constants";

export default function AiReportList() {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(DEFAULT_REPORT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    setCurrentPage(1);
  };
  const handleFiltersChange = (next) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const { data, isLoading, isError } = useReportList({
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: searchText,
    ...filters,
  });

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-[var(--color-header-text)]">AI 보고서</h2>

      <SearchFilterBar
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        placeholder="차량번호 검색"
      >
        {({ close }) => (
          <ReportFilterPanel
            initialFilters={filters}
            onApply={(next) => {
              handleFiltersChange(next);
              close();
            }}
          />
        )}
      </SearchFilterBar>

      <div className="card">
        {isError ? (
          <p className="py-10 text-center text-sm text-red-500">
            목록을 불러오지 못했습니다.
          </p>
        ) : (
          <ReportList reports={data?.items ?? []} isLoading={isLoading} />
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
