// src/mocks/carMock.js
import { MOCK_CHARGING_STATIONS } from "./chargingMock.js";

// StatCardList용 요약 데이터
export const MOCK_CAR_STATS = {
  total: 1240, // 전체 차량
  emergency: 12, // 긴급 차량
  warning: 45, // 경고 차량
  caution: 88, // 주의 차량
  normal: 1095, // 정상 차량
};

// 차량 목록 데이터
export const MOCK_CARS = [
  {
    id: "car-uuid-001",
    car_number: "123가 4567",
    name: "아이오닉 5",
    // 충전소 #1 (테헤란로)의 위치를 공유받음
    latitude: MOCK_CHARGING_STATIONS[0].latitude,
    longitude: MOCK_CHARGING_STATIONS[0].longitude,
    // ANOMALY_LOGS의 risk_level 기반 status (danger | warning | caution | 정상)
    status: "danger", // 긴급 -> danger
  },
  {
    id: "car-uuid-002",
    car_number: "89나 1234",
    name: "EV6",
    // 충전소 #2 (칠곡 왜관)의 위치를 공유받음
    latitude: MOCK_CHARGING_STATIONS[1].latitude,
    longitude: MOCK_CHARGING_STATIONS[1].longitude,
    status: "warning", // 경고 -> warning
  },
  {
    id: "car-uuid-003",
    car_number: "56다 9012",
    name: "레이 EV",
    // 충전소 #4 (판교)의 위치를 공유받음
    latitude: MOCK_CHARGING_STATIONS[3].latitude,
    longitude: MOCK_CHARGING_STATIONS[3].longitude,
    status: "caution", // 주의 -> caution
  },
];
