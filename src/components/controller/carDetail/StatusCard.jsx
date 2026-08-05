import StopChargingButton from "@/components/controller/carList/StopChargingButton";

// RISK_LEVEL_COLOR(carList.constants.js)와 같은 CSS 변수를 가리키지만, 인라인 style로 적용한다.
// .mini-card 기본 배경색이 Tailwind 유틸리티 클래스보다 우선순위가 높아서(!important 없이는)
// 클래스만으로는 안 먹혀 인라인 스타일로 확실히 덮어쓴다.
const RISK_LEVEL_BG_VAR = {
  긴급: "var(--color-risk-emergency)",
  경고: "var(--color-risk-warning)",
  주의: "var(--color-risk-caution)",
  정상: "var(--color-risk-normal)",
};

export default function StatusCard({ car, onStopCharging }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div
        className="mini-card flex flex-col gap-1"
        style={{ backgroundColor: RISK_LEVEL_BG_VAR[car.riskLevel] ?? "#9CA3AF" }}
      >
        <span className="text-sm text-white/80">이상 유형</span>
        <span className="text-lg font-bold text-white">
          {car.abnormalType ?? "-"}
        </span>
      </div>
      <div className="mini-card flex flex-col gap-1">
        <span className="text-sm text-[var(--color-sub-text)]">충전 시간</span>
        <span className="text-lg font-semibold text-[var(--color-header-text)]">
          {car.chargingTime ?? "-"}
        </span>
      </div>
      <div className="mini-card flex flex-col gap-1">
        <span className="text-sm text-[var(--color-sub-text)]">충전 상태</span>
        <span className="text-lg font-semibold text-[var(--color-header-text)]">
          {car.chargingStatus ?? "-"}
        </span>
      </div>
      <div className="mini-card flex flex-col items-start justify-center gap-1">
        <span className="text-sm text-[var(--color-sub-text)]">충전 제어</span>
        <StopChargingButton
          chargingStatus={car.chargingStatus}
          onClick={onStopCharging}
        />
      </div>
    </div>
  );
}
