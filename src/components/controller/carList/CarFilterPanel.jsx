import { useState } from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";
import {
  RISK_LEVELS,
  CHARGING_STATUSES,
  ANOMALY_TYPES,
  REGIONS,
  DEFAULT_CAR_FILTERS,
} from "@/constants/carList.constants";

//test
function RadioRow({ label, options, value, onChange }) {
  return (
    <div className="flex items-start gap-4 py-2">
      <span className="w-16 shrink-0 pt-0.5 text-sm font-semibold text-[var(--color-header-text)]">
        {label}
      </span>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-[var(--color-sub-text)]"
          >
            <input
              type="radio"
              name={label}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-3.5 w-3.5 accent-[var(--color-primary-btn)]"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}

const toOptions = (values) => [
  { value: "all", label: "전체" },
  ...values.map((v) => ({ value: v, label: v })),
];

const RISK_OPTIONS = toOptions(RISK_LEVELS);
const REGION_OPTIONS = toOptions(REGIONS);
const ANOMALY_OPTIONS = toOptions(ANOMALY_TYPES);
const STATUS_OPTIONS = toOptions(CHARGING_STATUSES);

export default function CarFilterPanel({ initialFilters, onApply }) {
  const [draft, setDraft] = useState(initialFilters ?? DEFAULT_CAR_FILTERS);

  const update = (key) => (value) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => setDraft(DEFAULT_CAR_FILTERS);
  const handleApply = () => onApply(draft);

  return (
    <div className="text-[var(--color-header-text)]">
      <RadioRow
        label="위험도"
        options={RISK_OPTIONS}
        value={draft.riskLevel}
        onChange={update("riskLevel")}
      />
      <RadioRow
        label="위치"
        options={REGION_OPTIONS}
        value={draft.region}
        onChange={update("region")}
      />
      <RadioRow
        label="이상 유형"
        options={ANOMALY_OPTIONS}
        value={draft.abnormalType}
        onChange={update("abnormalType")}
      />

      <div className="py-2">
        <div className="mb-1 flex items-center justify-between text-sm font-semibold text-[var(--color-header-text)]">
          <span>충전 시간</span>
          <span className="font-normal text-[var(--color-sub-text)]">
            {draft.chargingTimeFrom} ~ 전체
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1439"
          step="1"
          value={(() => {
            const [h, m] = draft.chargingTimeFrom.split(":").map(Number);
            return h * 60 + m;
          })()}
          onChange={(e) => {
            const minutes = Number(e.target.value);
            const h = String(Math.floor(minutes / 60)).padStart(2, "0");
            const m = String(minutes % 60).padStart(2, "0");
            update("chargingTimeFrom")(`${h}:${m}`);
          }}
          className="w-full accent-[var(--color-primary-btn)]"
        />
      </div>

      <RadioRow
        label="충전 상태"
        options={STATUS_OPTIONS}
        value={draft.chargingStatus}
        onChange={update("chargingStatus")}
      />

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
