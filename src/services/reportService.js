// AI 보고서 관련 API를 관리
import api from "../api/axios";

// TEMP: 백엔드 AI_REPORTS.car_id가 추가되면서 carId는 이제 실제 값이다.
// carNumber/carModel은 여전히 AI_REPORTS에 없어서 /api/cars에서 carId로 찾아 채운다
// (백엔드가 아직 더미 데이터라 carId가 요청마다 랜덤이라 지금은 거의 항상 매칭이 안 되고
// "-"로 남지만, 실제 DB가 연결되면 자동으로 채워진다).
// riskLevel도 AI_REPORTS엔 없어서(진짜론 anomaly_id -> ANOMALY_LOGS.risk_level을 조인해야
// 함) 임시로 "정상" 고정.
// reportData는 백엔드가 { summary: "..." } 같은 임의 문자열만 주는데, 프론트는
// { isAiGenerated, sections, actions } 구조를 기대해서 그대로 쓰면 상세 화면이 깨진다.
// 실제 스펙이 정해지기 전까진 null로 채워 "본문 없음" 상태로 안전하게 보여준다.
const mapReports = (reports, carsById) =>
  reports.map((report) => {
    const car = carsById.get(report.carId);
    return {
      reportId: report.reportId,
      title: report.title,
      reportType: report.reportType,
      riskLevel: "정상",
      carId: report.carId,
      carNumber: car?.carNumber ?? "-",
      carModel: car?.model ?? "-",
      createdAt: report.createdAt,
      isRead: report.isRead,
      reportData: null,
    };
  });

const fetchCarsById = async () => {
  const response = await api.get("/api/cars");
  return new Map(response.data.map((car) => [car.carId, car]));
};

export const reportService = {
  getReportList: async ({
    carId,
    page = 1,
    pageSize = 10,
    search = "",
    reportType = "all",
    dateFrom = "",
    dateTo = "",
  } = {}) => {
    const [reportsRes, carsById] = await Promise.all([
      api.get("/api/ai-reports"),
      fetchCarsById(),
    ]);
    let reports = mapReports(reportsRes.data, carsById);

    if (carId) reports = reports.filter((r) => r.carId === carId);

    const filtered = reports.filter((r) => {
      if (
        search &&
        !r.carNumber.includes(search.trim()) &&
        !r.title.includes(search.trim())
      )
        return false;
      if (reportType !== "all" && r.reportType !== reportType) return false;
      // createdAt은 "YYYY-MM-DDTHH:mm:ss..." 전체 시각이라 날짜만 비교하려면 앞 10자리만 사용
      const date = r.createdAt.slice(0, 10);
      if (dateFrom && date < dateFrom) return false;
      if (dateTo && date > dateTo) return false;
      return true;
    });

    const start = (page - 1) * pageSize;

    return {
      items: filtered.slice(start, start + pageSize),
      totalCount: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  },

  getReportDetail: async (reportId) => {
    const [reportRes, carsById] = await Promise.all([
      api.get(`/api/ai-reports/${reportId}`),
      fetchCarsById(),
    ]);
    return mapReports([reportRes.data], carsById)[0];
  },

  markReportAsRead: async (reportId) => {
    // 백엔드가 아직 진짜 DB가 아니라서 저장은 안 되지만(다음 조회 때 초기화), 요청 자체는 실제로 간다.
    const response = await api.put(`/api/ai-reports/${reportId}`, {
      isRead: true,
    });
    return response.data;
  },
};
