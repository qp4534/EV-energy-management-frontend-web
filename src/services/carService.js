// 자동차와 관련된 api를 관리할 예정
// CAR를 관리할 예정
import api from "../api/axios";
import {
  MOCK_CAR_STATS,
  MOCK_CARS,
  MOCK_ANOMALY_DAILY_COUNTS,
  MOCK_CAR_LIST,
} from "../mocks/carMock";
import { MOCK_THERMAL_STREAMS } from "../mocks/anomalyMock";

const USE_MOCK = true;

export const carService = {
  getCarStats: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_CAR_STATS;
    }
    const response = await api.get("/api/v1/cars/stats");
    return response.data;
  },

  getCarList: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_CARS;
    }
    const response = await api.get("/api/v1/cars");
    return response.data;
  },

  getDailyDangerCarCount: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ANOMALY_DAILY_COUNTS;
    }
    const response = await api.get("/api/v1/anomaly-logs/daily-count");
    return response.data;
  },

  getCarSummaryList: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [...MOCK_CAR_LIST].slice(0, 5);
    }
    const response = await api.get("/api/v1/cars?limit=5");
    return response.data;
  },

  // CarList.jsx 테이블 전용: 검색/필터/페이지네이션 지원.
  // getCarList(지도용, MOCK_CARS)와는 반환 구조가 다르므로 이름을 분리했다.
  getCarTableList: async ({
    page = 1,
    pageSize = 10,
    search = "",
    riskLevel = "all",
    region = "all",
    abnormalType = "all",
    chargingStatus = "all",
    chargingTimeFrom = "00:00",
  } = {}) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const filtered = MOCK_CAR_LIST.filter((car) => {
        if (search && !car.carNumber.includes(search.trim())) return false;
        if (riskLevel !== "all" && car.riskLevel !== riskLevel) return false;
        if (region !== "all" && car.region !== region) return false;
        if (abnormalType !== "all" && car.abnormalType !== abnormalType)
          return false;
        if (chargingStatus !== "all" && car.chargingStatus !== chargingStatus)
          return false;
        // chargingTime은 "HH:MM:SS", chargingTimeFrom은 "HH:MM" 형식
        if (chargingTimeFrom > car.chargingTime.slice(0, 5)) return false;
        return true;
      });

      const start = (page - 1) * pageSize;

      return {
        items: filtered.slice(start, start + pageSize),
        totalCount: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      };
    }

    // 실제 엔드포인트 경로/쿼리 파라미터명은 백엔드 스펙 확정 후 조정
    const response = await api.get("/api/v1/cars/table", {
      params: {
        page,
        pageSize,
        search,
        riskLevel,
        region,
        abnormalType,
        chargingStatus,
        chargingTimeFrom,
      },
    });
    return response.data;
  },

  getHottestThermalStream: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const sorted = [...MOCK_THERMAL_STREAMS].sort(
        (a, b) => b.metadata.maxTemp - a.metadata.maxTemp,
      );
      return sorted[0];
    }
    const response = await api.get("/api/v1/thermal-streams/hottest");
    return response.data;
  },

  getThermalStreamByCarId: async (carId) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return (
        MOCK_THERMAL_STREAMS.find((item) => item.carId === carId) ||
        MOCK_THERMAL_STREAMS[0]
      );
    }
    const response = await api.get(`/api/v1/thermal-streams/car/${carId}`);
    return response.data;
  },
};
