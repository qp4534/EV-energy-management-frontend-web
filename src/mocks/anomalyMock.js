import { createPlaceholderImage } from "../utils/placeholder";

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
    carId: "car-uuid-001",
    carNumber: "123가 4567",
    videoUrl: "https://example.com/streams/thermal-cam-01.m3u8",
    imageUrl: createPlaceholderImage(640, 360, "#8B0000", "Car 001"),
    metadata: {
      maxTemp: 88.5,
      minTemp: 24.1,
      avgTemp: 52.3,
      fps: 30,
      resolution: "1920x1080",
    },
  },
  {
    thermalId: "thermal-002",
    carId: "car-uuid-002",
    carNumber: "89나 1234",
    videoUrl: "https://example.com/streams/thermal-cam-02.m3u8",
    imageUrl: createPlaceholderImage(640, 360, "#FF8C00", "Car 002"),
    metadata: {
      maxTemp: 62.1,
      minTemp: 22.4,
      avgTemp: 38.7,
      fps: 30,
      resolution: "1920x1080",
    },
  },
  {
    thermalId: "thermal-003",
    carId: "car-uuid-003",
    carNumber: "56다 9012",
    videoUrl: "https://example.com/streams/thermal-cam-03.m3u8",
    imageUrl: createPlaceholderImage(640, 360, "#00008B", "Car 003"),
    metadata: {
      maxTemp: 36.5,
      minTemp: 20.1,
      avgTemp: 28.3,
      fps: 30,
      resolution: "1920x1080",
    },
  },
];
