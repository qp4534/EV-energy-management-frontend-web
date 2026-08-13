// src/mocks/carMock.js

// StatCardList용 요약 데이터
export const MOCK_CAR_STATS = {
  total: 1240,
  emergency: 12,
  warning: 45,
  caution: 88,
  normal: 1095,
};

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

// 차량 테이블 요약 목록 (CarTableCard / CarList / CarDetail용)
// chargingStatus: ERD CHARGING_SESSION.change_state 값 그대로 사용 (충전 중, 중단됨, 충전 완료, 대기 중)
//
// NOTE 1: model/vin/year는 CarDetail.jsx(차종 정보 카드)용으로 추가한 CAR 도메인 필드.
// year(연식)는 ERD CAR 테이블에 없는 컬럼이라 추가 필요 (car_id, car_number, model, vin, user_id뿐).
// NOTE 2: car-uuid-001의 model을 "넥쏘"로 넣었는데, 같은 carId를 쓰는 MOCK_CARS(지도용)와
// chargingMock.js의 MOCK_CHARGING_SESSIONS(세션용)에는 model "아이오닉 5"/vin이 다르게 들어있음.
// mock끼리 서로 안 맞는 상태라 실제 값 확정되면 세 군데를 같은 값으로 맞춰야 함.
export const MOCK_CAR_LIST = [
  {
    carId: "car-uuid-001",
    riskLevel: "긴급",
    carNumber: "12가 1234",
    region: "대구",
    abnormalType: "온도 상승",
    chargingTime: "14:00:00",
    chargingStatus: "충전 중",
    model: "넥쏘",
    vin: "KMHX0000000000000",
    year: 2026,
  },
  {
    carId: "car-uuid-002",
    riskLevel: "경고",
    carNumber: "34나 3456",
    region: "서울",
    abnormalType: "화재 위험",
    chargingTime: "14:00:00",
    chargingStatus: "충전 중",
    model: "EV6",
    vin: "KNAE313C1M5000002",
    year: 2024,
  },
  {
    carId: "car-uuid-003",
    riskLevel: "주의",
    carNumber: "56다 5678",
    region: "부산",
    abnormalType: "온도 상승",
    chargingTime: "14:00:00",
    chargingStatus: "중단됨",
    model: "레이 EV",
    vin: "KNAE300C1M5000003",
    year: 2023,
  },
  {
    carId: "car-uuid-004",
    riskLevel: "정상",
    carNumber: "78라 9012",
    region: "인천",
    abnormalType: "정상",
    chargingTime: "14:12:30",
    chargingStatus: "충전 완료",
    model: "니로 EV",
    vin: "KNAE300C1M5000004",
    year: 2022,
  },
  {
    carId: "car-uuid-005",
    riskLevel: "경고",
    carNumber: "90마 3456",
    region: "광주",
    abnormalType: "과충전 경고",
    chargingTime: "14:25:10",
    chargingStatus: "충전 중",
    model: "코나 일렉트릭",
    vin: "KNAE300C1M5000005",
    year: 2023,
  },
  {
    carId: "car-uuid-006",
    riskLevel: "정상",
    carNumber: "11바 7890",
    region: "대전",
    abnormalType: "정상",
    chargingTime: "14:30:00",
    chargingStatus: "대기 중",
    model: "포터2 일렉트릭",
    vin: "KNAE300C1M5000006",
    year: 2022,
  },
  {
    carId: "car-uuid-007",
    riskLevel: "긴급",
    carNumber: "22사 1357",
    region: "울산",
    abnormalType: "화재 위험",
    chargingTime: "14:40:15",
    chargingStatus: "충전 중",
    model: "봉고3 EV",
    vin: "KNAE300C1M5000007",
    year: 2021,
  },
  {
    carId: "car-uuid-008",
    riskLevel: "정상",
    carNumber: "33아 2468",
    region: "세종",
    abnormalType: "정상",
    chargingTime: "14:45:00",
    chargingStatus: "충전 완료",
    model: "아이오닉 6",
    vin: "KNAE300C1M5000008",
    year: 2025,
  },
  {
    carId: "car-uuid-009",
    riskLevel: "주의",
    carNumber: "44자 3690",
    region: "경기",
    abnormalType: "온도 상승",
    chargingTime: "15:00:00",
    chargingStatus: "충전 중",
    model: "GV60",
    vin: "KNAE300C1M5000009",
    year: 2024,
  },
  {
    carId: "car-uuid-010",
    riskLevel: "정상",
    carNumber: "55차 1470",
    region: "강원",
    abnormalType: "정상",
    chargingTime: "15:10:20",
    chargingStatus: "대기 중",
    model: "EV9",
    vin: "KNAE300C1M5000010",
    year: 2025,
  },
];
