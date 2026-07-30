import { useEffect, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import FilterButton from "./FilterButton";

export default function SearchFilterBar({
  searchText,
  onSearchTextChange,
  placeholder = "검색",
  filterAlign = "right",
  children,
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
      {children && <FilterButton align={filterAlign}>{children}</FilterButton>}

      <div className="flex h-10 w-64 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-login-frame)] px-3">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
          }}
          placeholder={placeholder}
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
