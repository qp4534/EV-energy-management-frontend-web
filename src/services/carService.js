// 자동차와 관련된 api를 관리할 예정
// CAR를 관리할 예정
import api from "../api/axios";
import { MOCK_CAR_STATS, MOCK_CARS } from "../mocks/carMock";

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
};
