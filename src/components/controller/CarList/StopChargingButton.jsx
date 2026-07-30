export default function StopChargingButton({ chargingStatus, onClick }) {
  const isStoppable = chargingStatus === "충전 중";

  return (
    <button
      type="button"
      disabled={!isStoppable}
      onClick={onClick}
      className={
        isStoppable
          ? "rounded-md border border-[var(--color-primary-btn)] bg-[var(--color-footer-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-header-text)] hover:bg-[var(--color-primary-btn)]"
          : "cursor-not-allowed rounded-md border border-[var(--color-border)] bg-[var(--color-bg-main)] px-3 py-1 text-xs font-semibold text-[var(--color-btn-desc)]"
      }
    >
      {isStoppable ? "충전 중단" : "중단 완료"}
    </button>
  );
}
