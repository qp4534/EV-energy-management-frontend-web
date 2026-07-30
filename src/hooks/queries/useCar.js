// carService 결과를 컴포넌트에 전달
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { carService } from "@/services/carService";
// 1. 차량 상태 집계 훅 (StatCardList.jsx 전용)
export const useCarStats = () => {
  return useQuery({
    queryKey: ["carStats"],
    queryFn: carService.getCarStats,
    refetchInterval: 5000, // 5초마다 실시간 자동 업데이트
  });
};

// 2. 차량 목록 조회 훅 (지도 마커 표시용 - MOCK_CARS 구조)
export const useCarList = () => {
  return useQuery({
    queryKey: ["carList"],
    queryFn: carService.getCarList,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
};

// 차량 요약 목록 조회 훅 (상위 5개, 대시보드 위젯용)
export const useCarSummaryList = () => {
  return useQuery({
    queryKey: ["carSummaryList"],
    queryFn: carService.getCarSummaryList,
    refetchInterval: 5000, // 실시간 갱신이 필요하다면 5초 간격 refetch (선택)
    staleTime: 1000 * 60, // 1분간 캐시 유지
  });
};

// CarList.jsx 페이지 전용: 검색/필터/페이지네이션이 반영된 차량 테이블 목록 조회 훅.
// useCarList(위 2번)는 지도용 MOCK_CARS를 반환하므로 테이블에는 이 훅을 사용한다.
// params 예) { page, pageSize, search, riskLevel, region, abnormalType, chargingStatus, chargingTimeFrom }
export const useCarTableList = (params) => {
  return useQuery({
    queryKey: ["carTableList", params],
    queryFn: () => carService.getCarTableList(params),
    // 페이지 전환 시 깜빡임 방지용 옵션. react-query v5라면
    // `placeholderData: keepPreviousData` (from "@tanstack/react-query")로 교체.
    keepPreviousData: true,
  });
};

// CarVehicleRow "충전 중단" 버튼용 뮤테이션. 성공하면 테이블 쿼리를 무효화해서
// 목록에 바뀐 충전 상태(중단됨)와 버튼 비활성화가 바로 반영되게 한다.
export const useStopCharging = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (carId) => carService.stopCharging(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carTableList"] });
    },
  });
};

// 최근 위험 차량 수 (일별) 조회 훅
export const useDailyDangerCarCount = () => {
  return useQuery({
    queryKey: ["dailyDangerCarCount"],
    queryFn: carService.getDailyDangerCarCount,
    staleTime: 1000 * 60 * 5,
  });
};

// 위험 차량 열화상 영상 조회 훅
export const useHottestThermalStream = () => {
  return useQuery({
    queryKey: ["thermalStream", "hottest"],
    queryFn: carService.getHottestThermalStream,
    refetchInterval: 3000, // 3초 간격 실시간 갱신
  });
};

// 특정 차량 ID에 대한 열화상 영상 조회 훅
export const useThermalStreamByCarId = (carId) => {
  return useQuery({
    queryKey: ["thermalStream", carId],
    queryFn: () => carService.getThermalStreamByCarId(carId),
    refetchInterval: 3000,
    enabled: !!carId, // carId가 전달되었을 때만 쿼리 실행
  });
};
