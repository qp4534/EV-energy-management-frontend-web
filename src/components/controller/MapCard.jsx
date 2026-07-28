import React from "react";
import Map from "./Map";
import { useStations } from "@/hooks/queries/useCharging";
import { useCarList } from "@/hooks/queries/useCar";

export default function MapCard() {
  const { data: stations = [], isLoading: isStationsLoading } = useStations();
  const { data: vehicles = [], isLoading: isVehiclesLoading } = useCarList();

  console.log("🔍 useCarList 원본 결과:", vehicles);

  if (isStationsLoading || isVehiclesLoading) {
    return (
      <div className="card">
        <p>지도 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>위험 차량 / 충전소 지도</h2>
      <Map stations={stations} vehicles={vehicles} />
    </div>
  );
}
