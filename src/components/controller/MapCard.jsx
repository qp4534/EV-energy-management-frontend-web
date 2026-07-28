import React from "react";
import Map from "./Map";
import { useStations } from "@/hooks/queries/useCharging";
import { useCarList } from "@/hooks/queries/useCar";

import { FaGasPump } from "react-icons/fa";
import { FaCar } from "react-icons/fa6";

export default function MapCard() {
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
    },
    {
      icon: <FaCar className="text-white" />,
      color: "bg-[#FF9900]",
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
    <div className="card">
      <h2>위험 차량 / 충전소 지도</h2>
      <div className="grid grid-cols-4 gap-x-8 items-center">
        <div className="col-span-3">
          <Map stations={stations} vehicles={vehicles} />
        </div>
        <div className="col-span-1 flex flex-col gap-6">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {/* 색상 원 및 아이콘 */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color} shadow-md`}
              >
                {item.icon}
              </div>
              <small className="font-semibold text-black text-sm">
                {item.label}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
