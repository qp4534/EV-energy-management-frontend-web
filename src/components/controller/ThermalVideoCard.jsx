import React from "react";
import ExpandButton from "../ExpandButton";
import ThermalVideo from "./ThermalVideo";
import { useHottestThermalStream } from "@/hooks/queries/useCar";

export default function ThermalVideoCard() {
  const { data: hottestCar, isLoading, isError } = useHottestThermalStream();

  if (isLoading) {
    return (
      <div className="card p-4 bg-white rounded-xl shadow border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">
            위험 차량 열화상 영상
          </h2>
          <ExpandButton to="/controller/cars" />
        </div>
        <div className="w-full aspect-[16/9] bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (isError || !hottestCar) {
    return (
      <div className="card p-4 bg-white rounded-xl shadow border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">
            위험 차량 열화상 영상
          </h2>
          <ExpandButton to="/controller/cars" />
        </div>
        <div className="text-red-500 text-center py-10">
          위험 차량 데이터를 불러오지 못했습니다.
        </div>
      </div>
    );
  }
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h2>위험 차량 열화상 영상</h2>
        <ExpandButton to="/controller/cars" />
      </div>
      <ThermalVideo carId={hottestCar.car_id} />
    </div>
  );
}
