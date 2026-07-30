import StopChargingButton from "@/components/controller/carList/StopChargingButton";

export default function StatusCard({ car, onStopCharging }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="mini-card flex flex-col gap-1 !border-red-600 !bg-red-600">
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
