import { useBatteryByCarId } from "@/hooks/queries/useBattery";

const formatMeasurementAge = (ageSeconds) => {
  const seconds = Math.max(0, Math.floor(Number(ageSeconds) || 0));
  if (seconds < 60) return `${seconds}초 전`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  return `${Math.floor(seconds / 86400)}일 전`;
};

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

  const liveMeasurement = battery.liveMeasurement;
  const liveTemperature = liveMeasurement?.maxCellTemperatureC;
  const hasLiveTemperature =
    liveTemperature !== null &&
    liveTemperature !== undefined &&
    Number.isFinite(Number(liveTemperature));
  const isStale = Boolean(liveMeasurement?.isStale);
  const temperatureValue = isStale
    ? "데이터 지연"
    : hasLiveTemperature
      ? `${Number(liveTemperature).toFixed(1)}°C`
      : "실시간 데이터 없음";
  const temperatureCaption = liveMeasurement?.observedAt
    ? `마지막 Twin 측정 · ${new Date(liveMeasurement.observedAt).toLocaleString("ko-KR")} · ${formatMeasurementAge(liveMeasurement.ageSeconds)}`
    : "차량 Twin 연결 대기 중";

  const rows = [
    { label: "제조사", value: battery.manufacturer },
    { label: "배터리 타입", value: battery.batteryType },
    { label: "정격 용량", value: battery.ratedCapacity },
    { label: "현재 SOH", value: `${battery.sohScore}%` },
    { label: "누적 충전 사이클", value: `${battery.chargeCycles}회` },
    {
      label: "현재 최고 셀 온도",
      value: temperatureValue,
      caption: temperatureCaption,
      emphasize: hasLiveTemperature && !isStale && Number(liveTemperature) >= 45,
    },
    { label: "최근 정밀점검일", value: battery.lastInspectedAt },
  ];

  return (
    <div className="card flex h-full flex-col gap-3">
      <h2>배터리 여권</h2>
      <dl className="flex flex-col">
        {rows.map(({ label, value, caption, emphasize }) => (
          <div
            key={label}
            className="flex items-center justify-between font-medium text-xl border-b border-[var(--color-border)] py-3"
          >
            <dt className="text-[var(--color-sub-text)]">{label}</dt>
            <dd
              className={
                `flex flex-col items-end ${
                  emphasize ? "text-red-600" : "text-[var(--color-header-text)]"
                }`
              }
            >
              <span>{value ?? "-"}</span>
              {caption && (
                <small className="text-xs font-normal text-[var(--color-btn-desc)]">
                  {caption}
                </small>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
