// carService 결과를 컴포넌트에 전달
import { useQuery } from "@tanstack/react-query";
import { carService } from "@/services/carService";
// 1. 차량 상태 집계 훅 (StatCardList.jsx 전용)
export const useCarStats = () => {
  return useQuery({
    queryKey: ["carStats"],
    queryFn: carService.getCarStats,
    refetchInterval: 5000, // 5초마다 실시간 자동 업데이트
  });
};

// 2. 차량 목록 조회 훅
export const useCarList = () => {
  return useQuery({
    queryKey: ["carList"],
    queryFn: carService.getCarList,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
};

// 차량 요약 목록 조회 훅 (상위 5개)
export const useCarSummaryList = () => {
  return useQuery({
    queryKey: ["carSummaryList"],
    queryFn: carService.getCarSummaryList,
    refetchInterval: 5000, // 실시간 갱신이 필요하다면 5초 간격 refetch (선택)
    staleTime: 1000 * 60, // 1분간 캐시 유지
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
