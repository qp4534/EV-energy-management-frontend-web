// 충전소 위치 정보 Mock Data (지도 UI 렌더링용)
export const MOCK_CHARGING_STATIONS = [
  {
    chargeId: "st-001",
    region: "서울특별시",
    address: "서울특별시 강남구 테헤란로 123",
    latitude: 37.4979,
    longitude: 127.0276,
  },
  {
    chargeId: "st-002",
    region: "경상북도",
    address: "경상북도 칠곡군 왜관읍 중앙로 45",
    latitude: 35.9956,
    longitude: 128.3981,
  },
];

// 충전 세션 및 연결 차량 Mock Data
export const MOCK_CHARGING_SESSIONS = [
  {
    sessionId: "session-uuid-001",
    startTime: "2026-07-27T09:00:00Z",
    endTime: null,
    changeState: "충전 중", // 충전 중, 중단됨, 충전 완료, 대기 중(주차중)
    car: {
      carId: "car-uuid-001",
      carNumber: "123가 4567",
      model: "아이오닉 5",
      vin: "KMHKR81DBNU000001",
    },
    chargeId: "st-001",
    thermalId: "thermal-001",
  },
  {
    sessionId: "session-uuid-002",
    startTime: "2026-07-27T08:15:00Z",
    endTime: "2026-07-27T09:30:00Z",
    changeState: "충전 완료",
    car: {
      carId: "car-uuid-002",
      carNumber: "89나 1234",
      model: "EV6",
      vin: "KNAE313C1M5000002",
    },
    chargeId: "st-002",
    thermalId: null,
  },
];
