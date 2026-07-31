import { useBatteryByCarId } from "@/hooks/queries/useBattery";

export default function BatteryPassportCard({ carId }) {
  const { data: battery, isLoading, isError } = useBatteryByCarId(carId);

  if (isLoading) {
    return (
      <div className="card flex h-full flex-col gap-3">
        <h2>배터리 여권</h2>
        <p className="text-sm text-[var(--color-btn-desc)]">불러오는 중...</p>
      </div>
    );
  }

  if (isError || !battery) {
    return (
      <div className="card flex h-full flex-col gap-3">
        <h2>배터리 여권</h2>
        <p className="text-sm text-red-500">
          배터리 정보를 불러오지 못했습니다.
        </p>
      </div>
    );
  }

  const rows = [
    { label: "제조사", value: battery.manufacturer },
    { label: "배터리 타입", value: battery.batteryType },
    { label: "정격 용량", value: battery.ratedCapacity },
    { label: "현재 SOH", value: `${battery.sohScore}%` },
    { label: "누적 충전 사이클", value: `${battery.chargeCycles}회` },
    {
      label: "배터리 온도",
      value: `${battery.currentTemp}°C`,
      emphasize: true,
    },
    { label: "최근 정밀점검일", value: battery.lastInspectedAt },
  ];

  return (
    <div className="card flex h-full flex-col gap-3">
      <h2>배터리 여권</h2>
      <dl className="flex flex-col">
        {rows.map(({ label, value, emphasize }) => (
          <div
            key={label}
            className="flex items-center justify-between font-medium text-xl border-b border-[var(--color-border)] py-3"
          >
            <dt className="text-[var(--color-sub-text)]">{label}</dt>
            <dd
              className={
                emphasize ? "text-red-600" : "text-[var(--color-header-text)]"
              }
            >
              {value ?? "-"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
