import { useEffect, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import FilterButton from "@/components/common/FilterButton";

export default function ReportDateSearchBar({
  dateFrom,
  dateTo,
  onSearch,
  filterAlign = "right",
  children,
}) {
  const [draftFrom, setDraftFrom] = useState(dateFrom);
  const [draftTo, setDraftTo] = useState(dateTo);

  useEffect(() => {
    setDraftFrom(dateFrom);
    setDraftTo(dateTo);
  }, [dateFrom, dateTo]);

  const commit = () => {
    if (draftFrom !== dateFrom || draftTo !== dateTo) {
      onSearch({ dateFrom: draftFrom, dateTo: draftTo });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commit();
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {children && <FilterButton align={filterAlign}>{children}</FilterButton>}

      <div className="flex h-10 w-72 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-login-frame)] px-3">
        <input
          type="date"
          value={draftFrom}
          onChange={(e) => setDraftFrom(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="검색 시작일"
          className="w-full text-sm text-[var(--color-header-text)] outline-none"
        />
        <span className="shrink-0 text-[var(--color-sub-text)]">~</span>
        <input
          type="date"
          value={draftTo}
          onChange={(e) => setDraftTo(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="검색 종료일"
          className="w-full text-sm text-[var(--color-header-text)] outline-none"
        />
      </div>

      <button
        type="button"
        onClick={commit}
        aria-label="검색"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-btn)] text-[var(--color-header-text)] hover:opacity-90"
      >
        <HiOutlineMagnifyingGlass className="h-5 w-5" />
      </button>
    </div>
  );
}
