import React from "react";
import { useThermalStreamByCarId } from "@/hooks/queries/useCar";

export default function ThermalVideo({ carId, fallbackImage }) {
  const { data: thermal, isLoading, isError } = useThermalStreamByCarId(carId);

  if (isLoading) {
    return (
      <div className="w-full flex-1 bg-gray-900 rounded-lg animate-pulse flex items-center justify-center text-gray-400">
        열화상 영상 로딩 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex-1 bg-gray-900 rounded-lg flex items-center justify-center text-red-400">
        영상을 불러올 수 없습니다.
      </div>
    );
  }

  const maxTempText = thermal?.metadata?.maxTemp
    ? `최고 ${thermal.metadata.maxTemp}°C 감지`
    : "최고 0°C 이상 감지";

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-2">
      <div className="relative w-full flex-1 min-h-0 bg-black rounded-lg overflow-hidden border border-gray-800">
        <img
          src={thermal?.imageUrl || fallbackImage}
          alt={`${thermal?.carNumber || "차량"} 열화상 영상`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="text-right shrink-0">
        <span className="text-sm font-bold text-red-600">{maxTempText}</span>
      </div>
    </div>
  );
}
