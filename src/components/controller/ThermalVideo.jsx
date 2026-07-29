import React from "react";
import { useThermalStreamByCarId } from "@/hooks/queries/useCar";

export default function ThermalVideo({ carId, fallbackImage }) {
  const { data: thermal, isLoading, isError } = useThermalStreamByCarId(carId);

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-900 rounded-lg animate-pulse flex items-center justify-center text-gray-400">
        열화상 영상 로딩 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center text-red-400">
        영상을 불러올 수 없습니다.
      </div>
    );
  }

  // 실시간 받아온 최고 온도값 또는 기본 문구 처리
  const maxTempText = thermal?.max_temperature
    ? `최고 ${thermal.max_temperature}°C 감지`
    : "최고 0°C 이상 감지";

  return (
    <div className="w-full flex flex-col gap-2">
      {/* 1. 비디오/이미지 영역 */}
      <div className="relative w-full aspect-[16/9] bg-black rounded-lg overflow-hidden border border-gray-800">
        <img
          src={thermal?.thermal_image_url || fallbackImage}
          alt={`${thermal?.car_number || "차량"} 열화상 영상`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. 우측 하단 빨간색 최고 온도 문구 영역 */}
      <div className="text-right">
        <span className="text-sm font-bold text-red-600">
          {thermal?.temperature_status || maxTempText}
        </span>
      </div>
    </div>
  );
}
