// 충전과 관련된 api를 관리할 예정
// CHARGING_STATION, CHARGING_SESSION과 관련된 api를 관리할 예정
import api from "../api/axios";
import { MOCK_CHARGING_STATIONS } from "../mocks/chargingMock";
import { MOCK_CARS } from "../mocks/carMock";

const USE_MOCK = true;

export const chargingService = {
  getStations: async () => {
    if (USE_MOCK) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(MOCK_CHARGING_STATIONS), 300),
      );
    }
    const response = await api.get("/api/v1/charging/stations");
    return response.data;
  },

  getMonitoringVehicles: async () => {
    if (USE_MOCK) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(MOCK_CARS), 300),
      );
    }
    const response = await api.get("/api/v1/charging/vehicles/monitoring");
    return response.data;
  },
};
