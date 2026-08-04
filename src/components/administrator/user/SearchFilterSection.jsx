import React from 'react';
import TabBar from '../common/TabBar';

const FILTER_TABS = [
  { key: '전체', label: '전체' },
  { key: '관리자', label: '관리자' },
  { key: '관제사', label: '관제사' },
  { key: '차주', label: '차주' },
];

export default function SearchFilterSection({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  activeFilter,
  onFilterChange
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
      <form className="flex min-w-[280px] flex-1 items-center gap-3" onSubmit={onSearchSubmit}>
        <div className="flex h-[38px] max-w-[360px] flex-1 items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-login-frame)] px-2.5 py-2">
          <span className="mr-1 text-[var(--color-sub-text)]">🔍</span>
          <input
            type="text"
            className="w-full flex-1 border-none bg-transparent text-sm text-[var(--color-header-text)] outline-none placeholder:text-[var(--color-sub-text)]"
            placeholder="이름 또는 이메일 검색"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="rounded-2xl border-none bg-[var(--color-primary-btn)] px-6 py-2 text-sm font-semibold whitespace-nowrap text-[var(--color-header-text)] transition-[filter] hover:brightness-95"
        >
          검색
        </button>
      </form>

      <TabBar tabs={FILTER_TABS} activeTab={activeFilter} onChange={onFilterChange} />
    </div>
  );
}