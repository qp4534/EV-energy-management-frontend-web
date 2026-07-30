import { useState } from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";
import {
  REPORT_TYPES,
  REPORT_TYPE_LABEL,
  DEFAULT_REPORT_FILTERS,
} from "@/constants/report.constants";

const REPORT_TYPE_OPTIONS = [
  { value: "all", label: "전체" },
  ...REPORT_TYPES.map((t) => ({ value: t, label: REPORT_TYPE_LABEL[t] })),
];

export default function ReportFilterPanel({ initialFilters, onApply }) {
  const [draft, setDraft] = useState(initialFilters ?? DEFAULT_REPORT_FILTERS);

  const update = (key) => (value) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => setDraft(DEFAULT_REPORT_FILTERS);
  const handleApply = () => onApply(draft);

  return (
    <div className="text-[var(--color-header-text)]">
      <div className="py-2">
        <span className="mb-1.5 block text-sm font-semibold">보고서 유형</span>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {REPORT_TYPE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-1.5 text-sm text-[var(--color-sub-text)]"
            >
              <input
                type="radio"
                name="reportType"
                checked={draft.reportType === option.value}
                onChange={() => update("reportType")(option.value)}
                className="h-3.5 w-3.5 accent-[var(--color-primary-btn)]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="py-2">
        <span className="mb-1.5 block text-sm font-semibold">날짜 범위</span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={draft.dateFrom}
            onChange={(e) => update("dateFrom")(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-header-text)] outline-none focus:border-[var(--color-primary-btn)]"
          />
          <span className="text-[var(--color-sub-text)]">~</span>
          <input
            type="date"
            value={draft.dateTo}
            onChange={(e) => update("dateTo")(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-header-text)] outline-none focus:border-[var(--color-primary-btn)]"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 border-t border-[var(--color-border)] pt-3">
        <button
          type="button"
          onClick={handleReset}
          aria-label="필터 초기화"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-sub-text)] hover:bg-[var(--color-bg-main)]"
        >
          <HiOutlineArrowPath className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="rounded-lg bg-[var(--color-primary-btn)] px-5 py-2 text-sm font-semibold text-[var(--color-header-text)] hover:opacity-90"
        >
          적용
        </button>
      </div>
    </div>
  );
}
