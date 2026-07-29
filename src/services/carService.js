// 자동차와 관련된 api를 관리할 예정
// CAR를 관리할 예정
import api from "../api/axios";
import {
  MOCK_CAR_STATS,
  MOCK_CARS,
  MOCK_ANOMALY_DAILY_COUNTS,
  MOCK_CAR_LIST,
  MOCK_CAR_THERMAL_DATA,
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
      console.log("🔍 [1. Service] MOCK_CARS 반환값:", MOCK_CARS);
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

  // 가장 위험한 차량의 열화상 스트리밍 데이터 조회
  getHottestThermalStream: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // max_temperature 기준 내림차순 정렬 후 1번째 항목 추출
      const sorted = [...MOCK_THERMAL_STREAMS].sort(
        (a, b) => b.max_temperature - a.max_temperature,
      );
      return sorted[0];
    }
    const response = await api.get("/api/v1/thermal-streams/hottest");
    return response.data;
  },

  // 차량 ID로 열화상 스트리밍 데이터 조회
  getThermalStreamByCarId: async (carId) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return (
        MOCK_THERMAL_STREAMS.find((item) => item.car_id === carId) ||
        MOCK_THERMAL_STREAMS[0]
      );
    }
    const response = await api.get(`/api/v1/thermal-streams/car/${carId}`);
    return response.data;
  },
};
