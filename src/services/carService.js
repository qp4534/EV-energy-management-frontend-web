// 자동차와 관련된 api를 관리할 예정
// CAR를 관리할 예정
import api from "../api/axios";
import {
  MOCK_CAR_STATS,
  MOCK_CARS,
  MOCK_ANOMALY_DAILY_COUNTS,
  MOCK_CAR_LIST,
} from "../mocks/carMock";

const USE_MOCK = true;

export const carService = {
  // 차량 상태별 수량 집계 (StatCardList용)
  getCarStats: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_CAR_STATS;
    }
    const response = await api.get("/api/v1/cars/stats");
    return response.data;
  },

  // 전체 차량 목록 조회
  getCarList: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_CARS;
    }
    const response = await api.get("/api/v1/cars");
    return response.data;
  },

  // 일별 위험 차량 수량 조회
  getDailyDangerCarCount: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ANOMALY_DAILY_COUNTS;
    }
    const response = await api.get("/api/v1/anomaly-logs/daily-count");
    return response.data;
  },

  // 차량 목록 조회
  getCarList: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_CAR_LIST;
    }
    const response = await api.get("/api/v1/cars");
    return response.data;
  },

  // 차량 요약 목록 조회 (상위 5개)
  getCarSummaryList: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Mock에서 우선순위 정렬 후 5개만 cut해서 반환
      return (
        [...MOCK_CAR_LIST]
          // 예: 긴급 > 경고 > 주의 > 정상 순 정렬 (필요시)
          .slice(0, 5)
      );
    }

    // 실제 백엔드 요청 시에도 limit 5를 전달
    const response = await api.get("/api/v1/cars?limit=5");
    return response.data;
  },
};
