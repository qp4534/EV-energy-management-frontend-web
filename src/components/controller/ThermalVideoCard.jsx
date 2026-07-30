import React from "react";
import ExpandButton from "../ExpandButton";
import ThermalVideo from "./ThermalVideo";
import { useHottestThermalStream } from "@/hooks/queries/useCar";

export default function ThermalVideoCard() {
  const { data: hottestCar, isLoading, isError } = useHottestThermalStream();

  if (isLoading) {
    return (
      <div className="card h-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2>위험 차량 열화상 영상</h2>
          <ExpandButton to="/controller/cars" />
        </div>
        <div className="w-full flex-1 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (isError || !hottestCar) {
    return (
      <div className="card h-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2>위험 차량 열화상 영상</h2>
          <ExpandButton to="/controller/cars" />
        </div>
        <div className="w-full flex-1 flex items-center justify-center text-red-500">
          위험 차량 데이터를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2>위험 차량 열화상 영상</h2>
        <ExpandButton to="/controller/cars" />
      </div>
      <ThermalVideo carId={hottestCar.carId} />
    </div>
  );
}
