// chargingService 결과를 컴포넌트에 전달
import { useQuery } from "@tanstack/react-query";
import { chargingService } from "@/services/chargingService";

export const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: chargingService.getStations,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 충전 기반 관제 차량 목록 훅
export const useMonitoringVehicles = () => {
  return useQuery({
    queryKey: ["monitoringVehicles"],
    queryFn: chargingService.getMonitoringVehicles,
    staleTime: 1000 * 60 * 5,
  });
};

// CarDetail.jsx(/controller/cars/:id)의 "상세 위치" 카드 전용.
// LocationCard가 carId만 받아서 이 훅으로 직접 조회하는 자기완결형 컴포넌트다.
export const useStationByCarId = (carId) => {
  return useQuery({
    queryKey: ["station", "byCar", carId],
    queryFn: () => chargingService.getStationByCarId(carId),
    enabled: !!carId,
  });
};
