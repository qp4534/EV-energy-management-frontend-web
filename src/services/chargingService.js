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

  // CarDetail.jsx "상세 위치" 카드용. 원래는 CHARGING_SESSION에서 carId로 세션을 찾아
  // 그 세션의 chargeId로 충전소를 찾는 조인이 필요하다.
  //
  // TEMP: USE_MOCK과 무관하게 항상 실제 API 호출. 다만 백엔드 /api/charging-sessions는
  // 아직 진짜 DB가 아니라 요청마다 carId/chargeId를 랜덤 UUID로 새로 생성해서 내려주기
  // 때문에, 실제 차량의 carId와 절대 일치하지 않는다 - 그래서 일치하는 세션을 못 찾으면
  // 첫 번째 충전소를 임시로 보여준다. ChargingSessionService가 실제 DB와 연결되어
  // carId가 진짜로 유지되면 이 폴백 없이 정확한 매칭이 될 것이다.
  getStationByCarId: async (carId) => {
    const [sessionsRes, stationsRes] = await Promise.all([
      api.get("/api/charging-sessions"),
      api.get("/api/charging-stations"),
    ]);
    const sessions = sessionsRes.data;
    const stations = stationsRes.data;

    const session = sessions.find((s) => s.carId === carId);
    const station =
      stations.find((st) => st.chargeId === session?.chargeId) ??
      stations[0] ??
      null;
    return station;
  },
};
