// AI 보고서 관련 API를 관리
import api from "../api/axios";
import { MOCK_AI_REPORTS } from "../mocks/reportMock";

const USE_MOCK = true;

export const reportService = {
  // carId를 넘기면 특정 차량의 보고서만(/controller/cars/:id/reports),
  // 안 넘기면 전체 차량 보고서(/controller/reports)를 조회한다.
  // 실제 엔드포인트 경로는 백엔드 스펙 확정 후 조정.
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
        if (dateFrom && r.createdAt < dateFrom) return false;
        if (dateTo && r.createdAt > dateTo) return false;
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

  // 보고서 상세 페이지를 열람했을 때 is_read = true로 표시.
  // 상세 페이지 컴포넌트에서 useMutation으로 호출하고, 성공 시 ["reportList"] 쿼리를 invalidate 하면
  // 목록의 NEW 뱃지가 자동으로 사라진다. (상세 페이지는 아직 미구현이라 여기 자리만 마련해둠)
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
