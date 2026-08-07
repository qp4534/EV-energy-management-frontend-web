import api from "../api/axios";
import { MOCK_THERMAL_STREAMS } from "../mocks/anomalyMock";

const RISK_LEVEL_TO_PIN_STATUS = {
  긴급: "danger",
  경고: "warning",
  주의: "caution",
};

const RISK_PRIORITY = { 긴급: 0, 경고: 1, 주의: 2, 정상: 3 };

const fetchVehicleRiskOverview = async () => {
  const response = await api.get("/api/dashboard/vehicle-risk-overview");
  return response.data;
};

const mapRiskVehicle = (vehicle) => ({
  carId: vehicle.carId,
  carNumber: vehicle.carNumber,
  model: vehicle.model,
  vin: vehicle.vin,
  riskLevel: vehicle.riskLevel,
  region: "-",
  abnormalType: vehicle.abnormalType ?? "정상",
  chargingTime: "-",
  chargingStatus: "대기중",
  detectedAt: vehicle.detectedAt,
});

const sortByRisk = (vehicles) =>
  [...vehicles].sort(
    (left, right) =>
      (RISK_PRIORITY[left.riskLevel] ?? 4) -
        (RISK_PRIORITY[right.riskLevel] ?? 4) ||
      left.carNumber.localeCompare(right.carNumber, "ko"),
  );

export const carService = {
  getCarStats: async () => {
    const overview = await fetchVehicleRiskOverview();
    return overview.summary;
  },

  // 위험 차량만 지도에 표시한다. 차량의 위치는 현재 충전 중인 세션의 충전소에서 가져온다.
  getCarList: async () => {
    const [overview, sessionsRes, chargersRes, stationsRes] = await Promise.all([
      fetchVehicleRiskOverview(),
      api.get("/api/charging-sessions"),
      api.get("/api/chargers"),
      api.get("/api/charging-stations"),
    ]);

    return overview.vehicles
      .map(mapRiskVehicle)
      .filter((vehicle) => vehicle.riskLevel !== "정상")
      .map((vehicle) => {
        const session = sessionsRes.data.find(
          (item) => item.carId === vehicle.carId,
        );
        const charger = chargersRes.data.find(
          (item) => item.chargerId === session?.chargerId,
        );
        const station = stationsRes.data.find(
          (item) => item.chargeId === charger?.chargeId,
        );
        if (!station) return null;

        return {
          ...vehicle,
          latitude: station.latitude,
          longitude: station.longitude,
          status: RISK_LEVEL_TO_PIN_STATUS[vehicle.riskLevel],
        };
      })
      .filter(Boolean);
  },

  getDailyDangerCarCount: async () => {
    const overview = await fetchVehicleRiskOverview();
    return overview.dailyRiskCounts;
  },

  getCarSummaryList: async () => {
    const overview = await fetchVehicleRiskOverview();
    return sortByRisk(overview.vehicles.map(mapRiskVehicle)).slice(0, 5);
  },

  getCarTableList: async ({
    page = 1,
    pageSize = 10,
    search = "",
    riskLevel = "all",
    region = "all",
    abnormalType = "all",
    chargingStatus = "all",
  } = {}) => {
    const overview = await fetchVehicleRiskOverview();
    const cars = overview.vehicles.map(mapRiskVehicle);

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
      items: sortByRisk(filtered).slice(start, start + pageSize),
      totalCount: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  },

  stopCharging: async (carId) => {
    return { carId, chargingStatus: "중단됨" };
  },

  getCarDetail: async (carId) => {
    const [carResponse, overview] = await Promise.all([
      api.get(`/api/cars/${carId}`),
      fetchVehicleRiskOverview(),
    ]);
    const riskVehicle = overview.vehicles.find(
      (vehicle) => vehicle.carId === carId,
    );
    return mapRiskVehicle({ ...carResponse.data, ...riskVehicle });
  },

  // 열화상 스트림 API는 아직 없어 기존 임시 스트림을 유지한다.
  getHottestThermalStream: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...MOCK_THERMAL_STREAMS].sort(
      (left, right) => right.metadata.maxTemp - left.metadata.maxTemp,
    )[0];
  },

  getThermalStreamByCarId: async (carId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return (
      MOCK_THERMAL_STREAMS.find((item) => item.carId === carId) ||
      MOCK_THERMAL_STREAMS[0]
    );
  },
};
