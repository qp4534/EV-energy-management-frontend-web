// 충전과 관련된 api를 관리할 예정
// CHARGING_STATION, CHARGING_SESSION과 관련된 api를 관리할 예정
import api from "../api/axios";
import { MOCK_CHARGING_STATIONS } from "../mocks/chargingMock";
import { MOCK_CARS } from "../mocks/carMock"; // 차량 mock도 함께 가져옴

const USE_MOCK = true;

export const chargingService = {
  // 1. 충전소 목록 조회
  getStations: async () => {
    if (USE_MOCK) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(MOCK_CHARGING_STATIONS), 300),
      );
    }
    const response = await api.get("/api/v1/charging/stations");
    return response.data;
  },

  // 2. 충전소 기반 관제 차량 목록 조회 (위치 + 위험도 포함)
  getMonitoringVehicles: async () => {
    if (USE_MOCK) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(MOCK_VEHICLES), 300),
      );
    }
    const response = await api.get("/api/v1/charging/vehicles/monitoring");
    return response.data;
  },
};
