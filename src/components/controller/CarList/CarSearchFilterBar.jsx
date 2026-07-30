import { useEffect, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import FilterButton from "@/components/common/FilterButton";
import CarFilterPanel from "./CarFilterPanel";

/**
 * 차량번호 검색 인풋 + 검색 조건(필터) 버튼.
 *
 * 타이핑하는 동안은 로컬(draft) 상태만 바뀌고, 검색 버튼을 누르거나 Enter를 칠 때만
 * 부모(onSearchTextChange)에 반영 -> 그때 실제 쿼리가 나간다. 매 글자마다 요청이 나가지 않는다.
 */
export default function CarSearchFilterBar({
  searchText,
  onSearchTextChange,
  filters,
  onFiltersChange,
}) {
  const [draft, setDraft] = useState(searchText);

  // 부모 쪽에서 검색어가 외부 요인으로 바뀌면(예: 초기화) 입력칸도 동기화
  useEffect(() => {
    setDraft(searchText);
  }, [searchText]);

  const commit = () => {
    if (draft !== searchText) onSearchTextChange(draft);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <FilterButton align="right">
        {({ close }) => (
          <CarFilterPanel
            initialFilters={filters}
            onApply={(next) => {
              onFiltersChange(next);
              close();
            }}
          />
        )}
      </FilterButton>

      <div className="flex h-10 w-64 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-login-frame)] px-3">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
          }}
          placeholder="차량번호 검색"
          className="w-full text-sm text-[var(--color-header-text)] outline-none placeholder:text-[var(--color-btn-desc)]"
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
