// 자동차와 관련된 api를 관리할 예정
// CAR를 관리할 예정
import api from "../api/axios";
import {
  MOCK_CARS,
  MOCK_ANOMALY_DAILY_COUNTS,
  MOCK_CAR_LIST,
} from "../mocks/carMock";
import { MOCK_THERMAL_STREAMS } from "../mocks/anomalyMock";

const USE_MOCK = true;

// TEMP: 백엔드(/api/cars)는 CAR 테이블 필드(carId/carNumber/model/vin/userId)만 준다.
// riskLevel/region/abnormalType/chargingTime/chargingStatus는 ANOMALY_LOGS,
// CHARGING_SESSION, CHARGING_STATION 등 다른 테이블 소속이라 지금 백엔드엔 없어서
// 화면이 안 깨지게 임시 기본값을 채운다. 실제 조인 응답 스펙이 정해지면 이 매핑은 지우고
// 서버 응답을 그대로 쓰면 된다.
const mapCarWithPlaceholders = (car) => ({
  carId: car.carId,
  carNumber: car.carNumber,
  model: car.model,
  vin: car.vin,
  riskLevel: "정상",
  region: "-",
  abnormalType: "정상",
  chargingTime: "-",
  chargingStatus: "대기 중",
});

const fetchMappedCars = async () => {
  const response = await api.get("/api/cars");
  return response.data.map(mapCarWithPlaceholders);
};

export const carService = {
  // TEMP: USE_MOCK과 무관하게 항상 실제 API 호출. 위 mapCarWithPlaceholders 설명 참고.
  // riskLevel이 지금은 항상 "정상"으로 채워지므로 emergency/warning/caution은 0으로 고정되고
  // normal에 전체 대수가 몰린다 — 진짜 위험도 분류가 필요하면 ANOMALY_LOGS 조인이 필요하다.
  getCarStats: async () => {
    const cars = await fetchMappedCars();
    return {
      total: cars.length,
      emergency: 0,
      warning: 0,
      caution: 0,
      normal: cars.length,
    };
  },

  // 지도 마커용(MapCard). CAR 테이블엔 위도/경도가 아예 없어서(위치는 CHARGING_STATION 소속)
  // 실제 API로 채울 방법이 없다 — 좌표 없는 마커를 억지로 한 점에 겹쳐 찍느니 지도가 준비될
  // 때까지는 mock을 유지한다.
  getCarList: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_CARS;
    }
    const response = await api.get("/api/v1/cars");
    return response.data;
  },

  // 일별 위험 차량 추이(ChartCard). 백엔드 더미 데이터는 매 요청마다 현재 시각으로만 채워지고
  // 날짜별 이력이 없어서(진짜 DB가 아직 없음) 5일치 추이를 만들 수가 없다 — mock 유지.
  getDailyDangerCarCount: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_ANOMALY_DAILY_COUNTS;
    }
    const response = await api.get("/api/v1/anomaly-logs/daily-count");
    return response.data;
  },

  // TEMP: USE_MOCK과 무관하게 항상 실제 API 호출 (getCarTableList와 동일한 매핑 재사용).
  getCarSummaryList: async () => {
    const cars = await fetchMappedCars();
    return cars.slice(0, 5);
  },

  // CarList.jsx 테이블 전용: 검색/필터/페이지네이션 지원.
  // getCarList(지도용, MOCK_CARS)와는 반환 구조가 다르므로 이름을 분리했다.
  //
  // TEMP: USE_MOCK과 무관하게 항상 실제 API를 호출한다. 매핑 설명은 파일 상단
  // mapCarWithPlaceholders 참고. 검색/필터/페이지네이션은 mock 때처럼 프론트에서
  // 처리 중(백엔드가 아직 쿼리 파라미터를 안 받음).
  getCarTableList: async ({
    page = 1,
    pageSize = 10,
    search = "",
    riskLevel = "all",
    region = "all",
    abnormalType = "all",
    chargingStatus = "all",
  } = {}) => {
    const cars = await fetchMappedCars();

    const filtered = cars.filter((car) => {
      if (search && !car.carNumber.includes(search.trim())) return false;
      if (riskLevel !== "all" && car.riskLevel !== riskLevel) return false;
      if (region !== "all" && car.region !== region) return false;
      if (abnormalType !== "all" && car.abnormalType !== abnormalType)
        return false;
      if (chargingStatus !== "all" && car.chargingStatus !== chargingStatus)
        return false;
      return true;
    });

    const start = (page - 1) * pageSize;

    return {
      items: filtered.slice(start, start + pageSize),
      totalCount: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  },

  // CarVehicleRow / CarDetail의 "충전 중단" 버튼용. ERD상 CHARGING_SESSION.change_state를
  // '중단됨'으로 바꾸는 액션에 해당하는데, 백엔드에 이런 액션 엔드포인트가 아직 없다
  // (charging-sessions는 범용 CRUD뿐 - carId로 세션을 찾아 상태만 바꾸는 기능 없음) - mock 유지.
  stopCharging: async (carId) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const car = MOCK_CAR_LIST.find((c) => c.carId === carId);
      if (car) car.chargingStatus = "중단됨";
      return { carId, chargingStatus: "중단됨" };
    }
    const response = await api.patch(`/api/v1/cars/${carId}/stop-charging`);
    return response.data;
  },

  // CarDetail.jsx(/controller/cars/:id)용 차량(CAR 도메인) 상세 조회.
  // 배터리 여권은 batteryService.getBatteryByCarId, 충전 위치는 chargingService.getStationByCarId로
  // 각 카드가 따로 조회한다(도메인별 분리) - 여기서는 CAR 테이블 성격의 필드만 반환.
  //
  // TEMP: USE_MOCK과 무관하게 항상 실제 API 호출. 매핑 설명은 파일 상단 mapCarWithPlaceholders 참고.
  getCarDetail: async (carId) => {
    const response = await api.get(`/api/cars/${carId}`);
    return mapCarWithPlaceholders(response.data);
  },

  // 열화상 스트림(THERMAL_VIDEO_STREAMS)은 백엔드 응답에 carId도, maxTemp 같은 정렬 가능한
  // 구조화 필드도 없다(metadata가 임의 JSON 문자열). "가장 뜨거운 차량" 정렬이나 carId로 찾기
  // 자체가 불가능해서 mock 유지.
  getHottestThermalStream: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const sorted = [...MOCK_THERMAL_STREAMS].sort(
        (a, b) => b.metadata.maxTemp - a.metadata.maxTemp,
      );
      return sorted[0];
    }
    const response = await api.get("/api/v1/thermal-streams/hottest");
    return response.data;
  },

  getThermalStreamByCarId: async (carId) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return (
        MOCK_THERMAL_STREAMS.find((item) => item.carId === carId) ||
        MOCK_THERMAL_STREAMS[0]
      );
    }
    const response = await api.get(`/api/v1/thermal-streams/car/${carId}`);
    return response.data;
  },
};
