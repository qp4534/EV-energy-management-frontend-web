import React from "react";
import ExpandButton from "../ExpandButton";
import { useCarSummaryList } from "@/hooks/queries/useCar";

const RISK_COLOR_MAP = {
  긴급: "bg-[#FF4D4D]", // 빨간색
  경고: "bg-[#FF9500]", // 주황색
  주의: "bg-[#FFDE00]", // 노란색
  정상: "bg-[#4CAF50]", // 초록색
};

export default function CarTableCard() {
  const { data: carList, isLoading, isError } = useCarSummaryList();

  if (isLoading) {
    return (
      <div className="card h-[320px] flex items-center justify-center">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card h-[320px] flex items-center justify-center">
        <p className="text-red-500">데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2>차량 목록</h2>
        <ExpandButton to="/controller/cars" />
      </div>
      <div className="max-h-[260px] overflow-y-auto pr-1">
        <table className="w-full text-center border-collapse">
          {/* 테이블 헤더 */}
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-gray-700 text-sm border-b border-gray-300">
              <th className="py-2 px-1 font-semibold text-center w-[15%]">
                상태
              </th>
              <th className="py-2 px-1 font-semibold text-center w-[25%]">
                차량번호
              </th>
              <th className="py-2 px-1 font-semibold text-center w-[15%]">
                위치
              </th>
              <th className="py-2 px-1 font-semibold text-center w-[25%]">
                이상 유형
              </th>
              <th className="py-2 px-1 font-semibold text-center w-[20%]">
                충전시간
              </th>
            </tr>
          </thead>

          {/* 테이블 바디 */}
          <tbody className="divide-y divide-gray-100 text-sm">
            {carList?.map((car) => (
              <tr
                key={car.car_id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* 상태 색상 라벨 박스 */}
                <td className="py-3 px-1 flex justify-center items-center">
                  <span
                    className={`w-10 h-6 rounded-[2px] block ${
                      RISK_COLOR_MAP[car.risk_level] || "bg-gray-300"
                    }`}
                    title={car.risk_level}
                  />
                </td>
                <td className="py-3 px-1 font-medium text-gray-800">
                  {car.car_number}
                </td>
                <td className="py-3 px-1 text-gray-700">{car.region}</td>
                <td className="py-3 px-1 text-gray-700">{car.abnormal_type}</td>
                <td className="py-3 px-1 text-gray-700">{car.charging_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
