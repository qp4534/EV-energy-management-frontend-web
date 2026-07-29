import React from "react";
import Map from "@/components/controller/Map";
import { useStations } from "@/hooks/queries/useCharging";
import { useCarList } from "@/hooks/queries/useCar";

import { FaGasPump } from "react-icons/fa";
import { FaCar } from "react-icons/fa6";

export default function ControllerMap() {
  const { data: stations = [], isLoading: isStationsLoading } = useStations();
  const { data: vehicles = [], isLoading: isVehiclesLoading } = useCarList();

  const legendItems = [
    {
      icon: <FaGasPump className="text-white text-base" />,
      color: "bg-[#547963]",
      label: "충전소",
    },
    {
      icon: <FaCar className="text-white" />,
      color: "bg-[#FF0000]",
      label: "긴급 차량",
    },
    {
      icon: <FaCar className="text-white" />,
      color: "bg-[#FF9900]",
      label: "경고 차량",
    },
    {
      icon: <FaCar className="text-white" />,
      color: "bg-[#FFDD33]",
      label: "주의 차량",
    },
  ];
  if (isStationsLoading || isVehiclesLoading) {
    return (
      <div className="card">
        <p>지도 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }
  return (
    <div>
      <h2>위험 차량 / 충전소 지도</h2>
      <div className="w-full, h-full">
        <Map stations={stations} vehicles={vehicles} />
      </div>
    </div>
  );
}
