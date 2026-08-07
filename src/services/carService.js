// 자동차와 관련된 api를 관리할 예정
// CAR를 관리할 예정
import api from "../api/axios";
import {
  MOCK_CAR_STATS,
  MOCK_ANOMALY_DAILY_COUNTS,
  MOCK_CAR_LIST,
} from "../mocks/carMock";
import { MOCK_THERMAL_STREAMS } from "../mocks/anomalyMock";

const USE_MOCK = false;

// CarPin.jsx의 bgColors 키(danger/warning/caution)와 맞춘 매핑. "정상"은 지도에 아예 안 찍히므로 없음.
const RISK_LEVEL_TO_PIN_STATUS = { 긴급: "danger", 경고: "warning", 주의: "caution" };

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
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_CAR_STATS;
    }
    const cars = await fetchMappedCars();
    return {
      total: cars.length,
      emergency: 0,
      warning: 0,
      caution: 0,
      normal: cars.length,
    };
  },

  // 지도 마커용(MapCard, "위험 차량 / 충전소 지도"). CAR 테이블 자체엔 위치가 없어서
  // 지금 충전 중인 차만 CAR -> CHARGING_SESSION -> CHARGER -> CHARGING_STATION 체인으로
  // 위치를 찾을 수 있다. 그리고 이 지도는 "위험 차량"만 찍는 지도라 riskLevel이 "정상"인
  // 차는 애초에 제외한다. riskLevel은 아직 ANOMALY_LOGS 조인이 없어 항상 "정상" placeholder라
  // 지금은 실제로 뜨는 핀이 0개인 게 정직한 상태다 - ANOMALY_LOGS가 연동되면 자동으로 채워진다.
  getCarList: async () => {
    const [carsRes, sessionsRes, chargersRes, stationsRes] = await Promise.all([
      api.get("/api/cars"),
      api.get("/api/charging-sessions"),
      api.get("/api/chargers"),
      api.get("/api/charging-stations"),
    ]);
    const sessions = sessionsRes.data;
    const chargers = chargersRes.data;
    const stations = stationsRes.data;

    return carsRes.data
      .map((car) => {
        const enriched = mapCarWithPlaceholders(car);
        if (enriched.riskLevel === "정상") return null;

        const session = sessions.find((s) => s.carId === car.carId);
        const charger = chargers.find((c) => c.chargerId === session?.chargerId);
        const station = stations.find((st) => st.chargeId === charger?.chargeId);
        if (!station) return null;

        return {
          ...enriched,
          latitude: station.latitude,
          longitude: station.longitude,
          status: RISK_LEVEL_TO_PIN_STATUS[enriched.riskLevel] ?? "danger",
        };
      })
      .filter(Boolean);
  },

  // 일별 위험 차량 추이(ChartCard). 백엔드 더미 데이터는 매 요청마다 현재 시각으로만 채워지고
  // 날짜별 이력이 없어서(진짜 DB가 아직 없음) 5일치 추이를 만들 수가 없다 — mock 유지.
  // USE_MOCK과 무관하게 항상 mock (백엔드에 /api/v1/anomaly-logs/daily-count 자체가 없음).
  getDailyDangerCarCount: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_ANOMALY_DAILY_COUNTS;
  },

  // TEMP: USE_MOCK과 무관하게 항상 실제 API 호출 (getCarTableList와 동일한 매핑 재사용).
  getCarSummaryList: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_CAR_LIST.slice(0, 5);
    }
    const cars = await fetchMappedCars();
    return cars.slice(0, 5);
  },

  // CarList.jsx 테이블 전용: 검색/필터/페이지네이션 지원.
  // getCarList(지도용, 위험 차량만)와는 반환 구조가 다르므로 이름을 분리했다.
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
    const cars = USE_MOCK
      ? await new Promise((resolve) => {
          setTimeout(() => resolve([...MOCK_CAR_LIST]), 200);
        })
      : await fetchMappedCars();

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
  // USE_MOCK과 무관하게 항상 mock (백엔드에 /api/v1/cars/:id/stop-charging 자체가 없음).
  stopCharging: async (carId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const car = MOCK_CAR_LIST.find((c) => c.carId === carId);
    if (car) car.chargingStatus = "중단됨";
    return { carId, chargingStatus: "중단됨" };
  },

  // CarDetail.jsx(/controller/cars/:id)용 차량(CAR 도메인) 상세 조회.
  // 배터리 여권은 batteryService.getBatteryByCarId, 충전 위치는 chargingService.getStationByCarId로
  // 각 카드가 따로 조회한다(도메인별 분리) - 여기서는 CAR 테이블 성격의 필드만 반환.
  //
  // TEMP: USE_MOCK과 무관하게 항상 실제 API 호출. 매핑 설명은 파일 상단 mapCarWithPlaceholders 참고.
  getCarDetail: async (carId) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const car = MOCK_CAR_LIST.find((item) => item.carId === carId);
      if (!car) throw new Error(`차량을 찾을 수 없습니다: ${carId}`);
      return { ...car };
    }
    const response = await api.get(`/api/cars/${carId}`);
    return mapCarWithPlaceholders(response.data);
  },

  // 열화상 스트림(THERMAL_VIDEO_STREAMS)은 백엔드 응답에 carId도, maxTemp 같은 정렬 가능한
  // 구조화 필드도 없다(metadata가 임의 JSON 문자열). "가장 뜨거운 차량" 정렬이나 carId로 찾기
  // 자체가 불가능해서 mock 유지. USE_MOCK과 무관하게 항상 mock (백엔드에 /api/v1/thermal-streams
  // 자체가 없음).
  getHottestThermalStream: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const sorted = [...MOCK_THERMAL_STREAMS].sort(
      (a, b) => b.metadata.maxTemp - a.metadata.maxTemp,
    );
    return sorted[0];
  },

  getThermalStreamByCarId: async (carId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return (
      MOCK_THERMAL_STREAMS.find((item) => item.carId === carId) ||
      MOCK_THERMAL_STREAMS[0]
    );
  },
};
