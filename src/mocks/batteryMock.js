// src/mocks/batteryMock.js

export const MOCK_BATTERY_LIST = [
  {
    batteryId: "uuid-001",
    carId: "car-uuid-001",
    manufacturer: "LG에너지솔루션",
    batteryType: "NCM811",
    ratedCapacity: "77.4kWh",
    sohScore: 94.5,
    chargeCycles: 320,
    reuseStatus: "양호",
    gradeDetail: "재사용(EV 재제조)급",
    currentTemp: 58,
    lastInspectedAt: "2026-05-02",
  },
  {
    batteryId: "uuid-002",
    carId: "car-uuid-002",
    manufacturer: "삼성SDI",
    batteryType: "LFP",
    ratedCapacity: "60.0kWh",
    sohScore: 88.2,
    chargeCycles: 540,
    reuseStatus: "노후",
    gradeDetail: "2차사용(ESS)급",
    currentTemp: 32,
    lastInspectedAt: "2026-04-10",
  },
];
