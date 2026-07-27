// src/mocks/carMock.js

// StatCardList용 요약 데이터
export const MOCK_CAR_STATS = {
  total: 1240, // 전체 차량
  emergency: 12, // 긴급 차량
  warning: 45, // 경고 차량
  caution: 88, // 주의 차량
  normal: 1095, // 정상 차량
};

// 차량 목록 데이터
export const MOCK_CAR_LIST = [
  {
    carId: "car-uuid-001",
    carNumber: "123가 4567",
    model: "아이오닉 5",
    vin: "KMHKR81DBNU000001",
    userId: "user-uuid-001",
    status: "긴급",
  },
  {
    carId: "car-uuid-002",
    carNumber: "89나 1234",
    model: "EV6",
    vin: "KNAE313C1M5000002",
    userId: "user-uuid-002",
    status: "정상",
  },
];
