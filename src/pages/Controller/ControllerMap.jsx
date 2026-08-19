import React, { useState } from "react";
import Map from "@/components/controller/Map";
import MapLegend from "@/components/controller/MapLegend";
import { useStations } from "@/hooks/queries/useCharging";
import { useCarList } from "@/hooks/queries/useCar";
import LoadingIndicator from "@/components/common/LoadingIndicator";

export default function ControllerMap() {
  const { data: stations = [], isLoading: isStationsLoading } = useStations();
  const { data: vehicles = [], isLoading: isVehiclesLoading } = useCarList();

  const [activeFilters, setActiveFilters] = useState({
    station: true,
    danger: true,
    warning: true,
    caution: true,
  });

  const toggleFilter = (key) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isStationsLoading || isVehiclesLoading) {
    return (
      <div className="card">
        <LoadingIndicator text="지도 데이터를 불러오는 중입니다..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-2">
      <h2>위험 차량 / 충전소 지도</h2>
      <div className="relative w-full flex-1 min-h-0">
        <MapLegend activeFilters={activeFilters} onToggle={toggleFilter} />
        <Map
          stations={stations}
          vehicles={vehicles}
          activeFilters={activeFilters}
        />
      </div>
    </div>
  );
}
