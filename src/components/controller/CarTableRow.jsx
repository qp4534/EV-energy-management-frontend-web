import React from "react";

const RISK_COLOR_MAP = {
  긴급: "bg-[#FF4D4D]", // 빨간색
  경고: "bg-[#FF9500]", // 주황색
  주의: "bg-[#FFDE00]", // 노란색
  정상: "bg-[#4CAF50]", // 초록색
};

export default function CarTableRow({ car, onClickRow }) {
  return (
    <div
      onClick={() => onClickRow?.(car.car_id)}
      className="grid grid-cols-[1fr_2.5fr_1.5fr_2.5fr_2fr] items-center text-center border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer py-2"
    >
      {/* 상태 색상 */}
      <div className="flex justify-center items-center">
        <span
          className={`w-10 h-6 rounded-[2px] block ${
            RISK_COLOR_MAP[car.risk_level] || "bg-gray-300"
          }`}
          title={car.risk_level}
        />
      </div>

      {/* 차량번호 */}
      <div className="font-medium">{car.car_number}</div>

      {/* 위치 */}
      <div>{car.region}</div>

      {/* 이상 유형 */}
      <div>{car.abnormal_type}</div>

      {/* 충전시간 */}
      <div>{car.charging_time}</div>
    </div>
  );
}
