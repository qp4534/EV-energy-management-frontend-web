// src/mocks/carMock.js

// StatCardList용 요약 데이터
export const MOCK_CAR_STATS = {
  total: 1240,
  emergency: 12,
  warning: 45,
  caution: 88,
  normal: 1095,
};

// 일별 위험 차량 수 (ChartCard용)
export const MOCK_ANOMALY_DAILY_COUNTS = [
  { date: "7/12", count: 2 },
  { date: "7/13", count: 4 },
  { date: "7/14", count: 1 },
  { date: "7/15", count: 3 },
  { date: "7/16", count: 2 },
];

// 지도 표시용 차량 목록
// (실제 API에서는 CAR + CHARGING_SESSION + ANOMALY_LOGS를 조인한 응답으로 예상)
export const MOCK_CARS = [
  {
    carId: "car-uuid-001",
    carNumber: "123가 4567",
    model: "아이오닉 5",
    latitude: 37.4979,
    longitude: 127.0276,
    status: "danger",
  },
  {
    carId: "car-uuid-002",
    carNumber: "89나 1234",
    model: "EV6",
    latitude: 35.9956,
    longitude: 128.3981,
    status: "warning",
  },
  {
    carId: "car-uuid-003",
    carNumber: "56다 9012",
    model: "레이 EV",
    latitude: 37.402056,
    longitude: 127.108212,
    status: "caution",
  },
];

// 차량 테이블 요약 목록 (CarTableCard / CarList용)
export const MOCK_CAR_LIST = [
  {
    carId: "car-uuid-001",
    riskLevel: "긴급",
    carNumber: "12가 1234",
    region: "대구",
    abnormalType: "온도 상승",
    chargingTime: "14:00:00",
  },
  {
    carId: "car-uuid-002",
    riskLevel: "경고",
    carNumber: "34나 3456",
    region: "서울",
    abnormalType: "화재 위험",
    chargingTime: "14:00:00",
  },
  {
    carId: "car-uuid-003",
    riskLevel: "주의",
    carNumber: "56다 5678",
    region: "부산",
    abnormalType: "온도 상승",
    chargingTime: "14:00:00",
  },
  {
    carId: "car-uuid-004",
    riskLevel: "정상",
    carNumber: "78라 9012",
    region: "인천",
    abnormalType: "정상",
    chargingTime: "14:12:30",
  },
  {
    carId: "car-uuid-005",
    riskLevel: "경고",
    carNumber: "90마 3456",
    region: "광주",
    abnormalType: "과충전 경고",
    chargingTime: "14:25:10",
  },
  {
    carId: "car-uuid-006",
    riskLevel: "정상",
    carNumber: "11바 7890",
    region: "대전",
    abnormalType: "정상",
    chargingTime: "14:30:00",
  },
  {
    carId: "car-uuid-007",
    riskLevel: "긴급",
    carNumber: "22사 1357",
    region: "울산",
    abnormalType: "화재 위험",
    chargingTime: "14:40:15",
  },
  {
    carId: "car-uuid-008",
    riskLevel: "정상",
    carNumber: "33아 2468",
    region: "세종",
    abnormalType: "정상",
    chargingTime: "14:45:00",
  },
  {
    carId: "car-uuid-009",
    riskLevel: "주의",
    carNumber: "44자 3690",
    region: "경기",
    abnormalType: "온도 상승",
    chargingTime: "15:00:00",
  },
  {
    carId: "car-uuid-010",
    riskLevel: "정상",
    carNumber: "55차 1470",
    region: "강원",
    abnormalType: "정상",
    chargingTime: "15:10:20",
  },
];
