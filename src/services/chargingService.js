// 충전과 관련된 api를 관리할 예정
// CHARGING_STATION, CHARGING_SESSION과 관련된 api를 관리할 예정
import api from "../api/axios";
import { MOCK_CARS } from "../mocks/carMock";

const USE_MOCK = true;

export const chargingService = {
  // TEMP: USE_MOCK과 무관하게 항상 실제 API 호출. 백엔드 ChargingStationDto가
  // (chargeId, region, address, latitude, longitude) mock과 필드가 완전히 같아서
  // 별도 매핑 없이 그대로 쓸 수 있다.
  getStations: async () => {
    const response = await api.get("/api/charging-stations");
    return response.data;
  },

  // 충전 기반 관제 차량 목록(현재 어느 화면에서도 호출되지 않는 훅). getCarList와 마찬가지로
  // CAR 테이블엔 위도/경도가 없어서 실제 API로 채울 방법이 없어 mock 유지.
  getMonitoringVehicles: async () => {
    if (USE_MOCK) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(MOCK_CARS), 300),
      );
    }
    const response = await api.get("/api/v1/charging/vehicles/monitoring");
    return response.data;
  },

  // CarDetail.jsx "상세 위치" 카드용. CAR 테이블엔 위치가 없어서 CAR -> (활성) CHARGING_SESSION
  // -> chargerId로 CHARGER -> chargeId로 CHARGING_STATION, 이렇게 2단 조인해야 위치가 나온다.
  // 이 차가 지금 충전 세션이 없으면(주차만 하고 있으면) 애초에 위치를 알 방법이 없어서
  // 그 경우엔 첫 번째 충전소로 폴백한다.
  getStationByCarId: async (carId) => {
    const [sessionsRes, chargersRes, stationsRes] = await Promise.all([
      api.get("/api/charging-sessions"),
      api.get("/api/chargers"),
      api.get("/api/charging-stations"),
    ]);
    const sessions = sessionsRes.data;
    const chargers = chargersRes.data;
    const stations = stationsRes.data;

    const session = sessions.find((s) => s.carId === carId);
    const charger = chargers.find((c) => c.chargerId === session?.chargerId);
    const station =
      stations.find((st) => st.chargeId === charger?.chargeId) ??
      stations[0] ??
      null;
    return station;
  },
};
