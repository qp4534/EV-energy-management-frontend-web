import Map from "@/components/controller/Map";
import { useStationByCarId } from "@/hooks/queries/useCharging";

const RISK_TO_MAP_STATUS = {
  긴급: "danger",
  경고: "warning",
  주의: "caution",
  정상: "normal",
};

export default function LocationCard({ carId, riskLevel }) {
  const { data: station, isLoading, isError } = useStationByCarId(carId);

  if (isLoading) {
    return (
      <div className="card flex h-full flex-col gap-3">
        <h2>상세 위치</h2>
        <p className="text-sm text-[var(--color-btn-desc)]">불러오는 중...</p>
      </div>
    );
  }

  if (isError || !station) {
    return (
      <div className="card flex h-full flex-col gap-3">
        <h2>상세 위치</h2>
        <p className="text-sm text-red-500">위치 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const vehicles = [
    {
      carId,
      latitude: station.latitude,
      longitude: station.longitude,
      status: RISK_TO_MAP_STATUS[riskLevel] ?? "caution",
    },
  ];

  return (
    <div className="card flex h-full flex-col gap-3">
      <h2>상세 위치</h2>
      <div className="h-[220px] w-full">
        <Map vehicles={vehicles} />
      </div>
      <dl className="flex flex-col gap-1 text-base">
        <div className="flex justify-end gap-4">
          <dd className="text-right text-[var(--color-header-text)]">
            {station.address}
          </dd>
        </div>
      </dl>
    </div>
  );
}
