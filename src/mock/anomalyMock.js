// 이상 감지 로그 Mock Data
export const MOCK_ANOMALY_LOGS = [
  {
    anomalyId: "a1b2c3d4-0001-uuid",
    abnormalType: "온도 급증", // 화재 위험, 온도 상승, 정상 등
    sourceType: "열화상 카메라",
    triggerValue: "58.4°C",
    detectedAt: "2026-07-27T10:15:30Z",
    riskLevel: "경고", // 긴급, 경고, 주의, 정상
    carId: "car-uuid-001",
    sessionId: "session-uuid-001",
  },
  {
    anomalyId: "a1b2c3d4-0002-uuid",
    abnormalType: "전압 불안정",
    sourceType: "BMS 센서",
    triggerValue: "3.2V (임계치 이탈)",
    detectedAt: "2026-07-27T09:40:12Z",
    riskLevel: "주의",
    carId: "car-uuid-002",
    sessionId: "session-uuid-002",
  },
  {
    anomalyId: "a1b2c3d4-0003-uuid",
    abnormalType: "화재 위험",
    sourceType: "열화상+BMS",
    triggerValue: "72.1°C",
    detectedAt: "2026-07-26T18:22:00Z",
    riskLevel: "긴급",
    carId: "car-uuid-003",
    sessionId: "session-uuid-003",
  },
];

// 열화상 비디오 스트림 Mock Data
export const MOCK_THERMAL_STREAMS = [
  {
    thermalId: "thermal-001",
    videoUrl: "https://example.com/streams/thermal-cam-01.m3u8",
    metadata: {
      maxTemp: 58.4,
      minTemp: 24.1,
      avgTemp: 32.5,
      fps: 30,
      resolution: "1920x1080",
    },
  },
];
