// 배터리와 관련된 api를 관리할 예정
// BATTERY_PASSPORT, BATTERY_OFFER, BATTERY_PROPOSALS, BATTERY_DIAGBNOSIS_METRICS와 관련된 api를 관리할 예정
import api from "../api/axios";

export const batteryService = {
  // CarDetail.jsx(/controller/cars/:id)의 "배터리 여권" 카드 전용.
  // 차량 1대의 BATTERY_PASSPORT를 carId로 조회한다.
  //
  // TEMP: 항상 실제 API 호출. 백엔드 BatteryPassportDto 필드명(manufacturer/batteryType/
  // ratedCapacity/sohScore/chargeCycles/currentTemp/lastInspectedAt/carId 등)이 mock과
  // 완전히 같아서 매핑이 필요 없다. 다만 백엔드엔 "carId로 조회" 엔드포인트가 없어서
  // 목록(/api/battery-passports)을 받아 carId가 일치하는 것을 찾는다 - 지금은 더미 데이터라
  // carId가 매 요청 랜덤이라 거의 항상 못 찾고, 그 경우 첫 번째 항목을 임시로 보여준다.
  // (chargingService.getStationByCarId와 동일한 패턴 - 실제 DB가 연결되면 자동으로 정확해진다)
  getBatteryByCarId: async (carId) => {
    const response = await api.get("/api/battery-passports");
    const batteries = response.data;
    return batteries.find((b) => b.carId === carId) ?? batteries[0] ?? null;
  },
};
