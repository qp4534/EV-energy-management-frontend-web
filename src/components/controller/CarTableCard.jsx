import React from "react";
import ExpandButton from "../ExpandButton";
import { useCarSummaryList } from "@/hooks/queries/useCar";
import CarTableRow from "./CarTableRow";
import LoadingIndicator from "@/components/common/LoadingIndicator";

export default function CarTableCard() {
  const { data: carList, isLoading, isError } = useCarSummaryList();

  if (isLoading) {
    return (
      <div className="card h-full flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card h-full flex items-center justify-center">
        <p className="text-red-500">데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="card h-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2>차량 목록</h2>
        <ExpandButton to="/controller/cars" />
      </div>
      <div>
        <div className="grid grid-cols-[1fr_2.5fr_1.5fr_2.5fr_2fr] text-center font-semibold border-b border-gray-300">
          <div>상태</div>
          <div>차량번호</div>
          <div>위치</div>
          <div>이상 유형</div>
          <div>충전시간</div>
        </div>
        <div className="flex flex-col">
          {carList?.map((car) => (
            <CarTableRow key={car.carId} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}
