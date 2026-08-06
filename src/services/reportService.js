// AI 보고서 관련 API를 관리
import api from "../api/axios";

const REPORT_TYPE_ALIAS = {
  MONTHLY: "MONTHLY",
  월간: "MONTHLY",
  월간보고서: "MONTHLY",
  ANOMALY: "ANOMALY",
  이상: "ANOMALY",
  이상보고서: "ANOMALY",
};

const RISK_LEVEL_ALIAS = {
  EMERGENCY: "EMERGENCY",
  긴급: "EMERGENCY",
  위험: "EMERGENCY",
  WARNING: "WARNING",
  경고: "WARNING",
  CAUTION: "CAUTION",
  주의: "CAUTION",
  NORMAL: "NORMAL",
  정상: "NORMAL",
  UNKNOWN: "UNKNOWN",
};

const legacyReportData = (content) => ({
  schemaVersion: "legacy",
  isAiGenerated: true,
  riskLevel: "UNKNOWN",
  sections: [
    {
      type: "summary",
      title: "보고서 요약",
      content,
    },
  ],
  sources: [],
  missingFields: [],
  actions: [],
});

const normalizeReportData = (value) => {
  if (!value) return null;

  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return legacyReportData(value);
    }
  }

  if (typeof parsed !== "object" || Array.isArray(parsed)) return null;
  if (Array.isArray(parsed.sections)) return parsed;
  if (typeof parsed.summary === "string" && parsed.summary.trim()) {
    return { ...legacyReportData(parsed.summary), ...parsed };
  }
  return null;
};

const mapReports = (reports, carsById) =>
  reports.map((report) => {
    const car = carsById.get(report.carId);
    const reportData = normalizeReportData(report.reportData);
    return {
      reportId: report.reportId,
      title: report.title,
      reportType:
        REPORT_TYPE_ALIAS[report.reportType] ?? report.reportType ?? "MONTHLY",
      riskLevel:
        RISK_LEVEL_ALIAS[reportData?.riskLevel] ?? reportData?.riskLevel ?? "UNKNOWN",
      carId: report.carId,
      carNumber: car?.carNumber ?? "-",
      carModel: car?.model ?? "-",
      createdAt: report.createdAt,
      isRead: Boolean(report.isRead),
      reportData,
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
    const response = await api.patch(`/api/ai-reports/${reportId}/read`);
    return response.data;
  },
};
