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

// 차량별 열화상 데이터
export const MOCK_CAR_THERMAL_DATA = {
  car_id: "car-uuid-001",
  car_number: "123가 4567",
  max_temperature: 38.5, // 감지된 최고 온도
  temperature_status: "0°C 이상 감지", // 안내 문구
  // 열화상 비디오 또는 캡처 이미지 URL
  thermal_image_url: "https://your-domain.com/path/to/thermal-image.png",
  is_streaming: true,
  updated_at: "2026-07-29T09:33:41",
};

// 차량별 열화상 스트리밍 데이터 (실시간)
export const MOCK_THERMAL_STREAMS = [
  {
    car_id: "car-uuid-001",
    car_number: "123가 4567",
    max_temperature: 88.5, // ⚠️ 가장 온도가 높은 위험 차량
    temperature_status: "최고 88.5°C 이상 감지",
    thermal_image_url:
      "https://via.placeholder.com/640x360/8B0000/FFFFFF?text=Thermal+Stream+Car+001",
    is_streaming: true,
  },
  {
    car_id: "car-uuid-002",
    car_number: "89나 1234",
    max_temperature: 62.1,
    temperature_status: "최고 62.1°C 감지",
    thermal_image_url:
      "https://via.placeholder.com/640x360/FF8C00/FFFFFF?text=Thermal+Stream+Car+002",
    is_streaming: true,
  },
  {
    car_id: "car-uuid-003",
    car_number: "56다 9012",
    max_temperature: 36.5,
    temperature_status: "최고 36.5°C 감지",
    thermal_image_url:
      "https://via.placeholder.com/640x360/00008B/FFFFFF?text=Thermal+Stream+Car+003",
    is_streaming: true,
  },
];

// 차량 목록 데이터
export const MOCK_CARS = [
  {
    id: "car-uuid-001",
    car_number: "123가 4567",
    name: "아이오닉 5",
    // 강남 테헤란로 충전소 좌표 직접 명시
    latitude: 37.4979,
    longitude: 127.0276,
    status: "danger", // 긴급 -> danger
  },
  {
    id: "car-uuid-002",
    car_number: "89나 1234",
    name: "EV6",
    // 칠곡 왜관 충전소 좌표 직접 명시
    latitude: 35.9956,
    longitude: 128.3981,
    status: "warning", // 경고 -> warning
  },
  {
    id: "car-uuid-003",
    car_number: "56다 9012",
    name: "레이 EV",
    // 판교 테크노밸리 충전소 좌표 직접 명시
    latitude: 37.402056,
    longitude: 127.108212,
    status: "caution", // 주의 -> caution
  },
];

export const MOCK_ANOMALY_DAILY_COUNTS = [
  { date: "7/12", count: 2 },
  { date: "7/13", count: 4 },
  { date: "7/14", count: 1 },
  { date: "7/15", count: 3 },
  { date: "7/16", count: 2 },
];

export const MOCK_CAR_LIST = [
  {
    car_id: "car-uuid-001",
    risk_level: "긴급", // 빨강
    car_number: "12가 1234",
    region: "대구",
    abnormal_type: "온도 상승",
    charging_time: "14:00:00",
  },
  {
    car_id: "car-uuid-002",
    risk_level: "경고", // 주황
    car_number: "34나 3456",
    region: "서울",
    abnormal_type: "화재 위험",
    charging_time: "14:00:00",
  },
  {
    car_id: "car-uuid-003",
    risk_level: "주의", // 노랑
    car_number: "56다 5678",
    region: "부산",
    abnormal_type: "온도 상승",
    charging_time: "14:00:00",
  },
  {
    car_id: "car-uuid-004",
    risk_level: "정상", // 초록/회색계열
    car_number: "78라 9012",
    region: "인천",
    abnormal_type: "정상",
    charging_time: "14:12:30",
  },
  {
    car_id: "car-uuid-005",
    risk_level: "경고",
    car_number: "90마 3456",
    region: "광주",
    abnormal_type: "과충전 경고",
    charging_time: "14:25:10",
  },
  {
    car_id: "car-uuid-006",
    risk_level: "정상",
    car_number: "11바 7890",
    region: "대전",
    abnormal_type: "정상",
    charging_time: "14:30:00",
  },
  {
    car_id: "car-uuid-007",
    risk_level: "긴급",
    car_number: "22사 1357",
    region: "울산",
    abnormal_type: "화재 위험",
    charging_time: "14:40:15",
  },
  {
    car_id: "car-uuid-008",
    risk_level: "정상",
    car_number: "33아 2468",
    region: "세종",
    abnormal_type: "정상",
    charging_time: "14:45:00",
  },
  {
    car_id: "car-uuid-009",
    risk_level: "주의",
    car_number: "44자 3690",
    region: "경기",
    abnormal_type: "온도 상승",
    charging_time: "15:00:00",
  },
  {
    car_id: "car-uuid-010",
    risk_level: "정상",
    car_number: "55차 1470",
    region: "강원",
    abnormal_type: "정상",
    charging_time: "15:10:20",
  },
];
