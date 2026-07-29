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
