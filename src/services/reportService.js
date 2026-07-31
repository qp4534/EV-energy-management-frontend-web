// AI 보고서 관련 API를 관리
import api from "../api/axios";
import { MOCK_AI_REPORTS } from "../mocks/reportMock";

const USE_MOCK = true;

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
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      let filtered = MOCK_AI_REPORTS;
      if (carId) filtered = filtered.filter((r) => r.carId === carId);

      filtered = filtered.filter((r) => {
        if (search && !r.carNumber.includes(search.trim())) return false;
        if (reportType !== "all" && r.reportType !== reportType) return false;
        // createdAt은 "YYYY-MM-DDTHH:mm:ss" 전체 시각이라 날짜만 비교하려면 앞 10자리만 사용
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
    }

    const url = carId ? `/api/v1/cars/${carId}/reports` : "/api/v1/reports";
    const response = await api.get(url, {
      params: { page, pageSize, search, reportType, dateFrom, dateTo },
    });
    return response.data;
  },

  getReportDetail: async (reportId) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const report = MOCK_AI_REPORTS.find((r) => r.reportId === reportId);
      if (!report) throw new Error(`보고서를 찾을 수 없습니다: ${reportId}`);
      return report;
    }
    const response = await api.get(`/api/v1/reports/${reportId}`);
    return response.data;
  },

  markReportAsRead: async (reportId) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const report = MOCK_AI_REPORTS.find((r) => r.reportId === reportId);
      if (report) report.isRead = true;
      return { reportId, isRead: true };
    }
    const response = await api.patch(`/api/v1/reports/${reportId}/read`);
    return response.data;
  },
};
