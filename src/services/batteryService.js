// 배터리와 관련된 api를 관리할 예정
// BATTERY_PASSPORT, BATTERY_OFFER, BATTERY_PROPOSALS, BATTERY_DIAGBNOSIS_METRICS와 관련된 api를 관리할 예정
import api from "../api/axios";
import { MOCK_BATTERY_LIST } from "../mocks/batteryMock";

const USE_MOCK = true;

export const batteryService = {
  // CarDetail.jsx(/controller/cars/:id)의 "배터리 여권" 카드 전용.
  // 차량 1대의 BATTERY_PASSPORT를 carId로 조회한다.
  getBatteryByCarId: async (carId) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const battery = MOCK_BATTERY_LIST.find((b) => b.carId === carId);
      if (!battery) throw new Error(`배터리 정보를 찾을 수 없습니다: ${carId}`);
      return battery;
    }
    const response = await api.get(`/api/v1/batteries/car/${carId}`);
    return response.data;
  },
};
