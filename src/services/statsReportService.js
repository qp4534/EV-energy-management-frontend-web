// 통계/리포트 조회(StatsReport.jsx)와 관련된 api를 관리
import api from "../api/axios";

export const statsReportService = {
  // "이용자" 탭
  getUserTypeDistribution: async () => {
    const { data } = await api.get("/api/stats-report/user/type-distribution");
    return data;
  },

  getMemberTrend: async () => {
    const { data } = await api.get("/api/stats-report/user/member-trend");
    return data;
  },

  getUserSummaryStats: async () => {
    const { data } = await api.get("/api/stats-report/user/summary");
    return data;
  },

  // "배터리 진단" 탭
  getBatteryDiagnosisTrend: async () => {
    const { data } = await api.get("/api/stats-report/battery/diagnosis-trend");
    return data;
  },

  getBatterySohTrend: async () => {
    const { data } = await api.get("/api/stats-report/battery/soh-trend");
    return data;
  },

  getBatteryGradeDistribution: async () => {
    const { data } = await api.get("/api/stats-report/battery/grade-distribution");
    return data;
  },

  // 진단 지표 평균
  getBatteryMetricAverage: async () => {
    const { data } = await api.get("/api/stats-report/battery/metric-average");
    return data;
  },

  // 최근 진단 이력
  getRecentDiagnoses: async (limit = 6) => {
    const { data } = await api.get("/api/stats-report/battery/recent-diagnoses", {
      params: { limit },
    });
    return data;
  },

  // "화재 예방" 탭 - 위험등급별 차량 수는 이미 있는 대시보드용 엔드포인트를 그대로 재사용
  getVehicleRiskOverview: async () => {
    const { data } = await api.get("/api/dashboard/vehicle-risk-overview");
    return data;
  },

  getFireSummaryStats: async () => {
    const { data } = await api.get("/api/stats-report/fire/summary");
    return data;
  },

  getAlertTrend: async () => {
    const { data } = await api.get("/api/stats-report/fire/alert-trend");
    return data;
  },
};