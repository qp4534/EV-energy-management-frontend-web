// 관리자 메인(AdministratorMain.jsx) 대시보드 카드들과 관련된 api를 관리
import api from "../api/axios";

export const dashboardService = {
  // "이용자" 카드 왼쪽 도넛 - 차주가 보유한 차량 모델별 분포
  getCarModelDistribution: async () => {
    const { data } = await api.get("/api/dashboard/car-model-distribution");
    return data;
  },

  // "이용자" 카드 오른쪽 도넛 - 관리자/관제자 인원수
  getUserRoleDistribution: async () => {
    const { data } = await api.get("/api/dashboard/user-role-distribution");
    return data;
  },

  // 신규 가입자 / 탈퇴자 추이 (최근 7개월)
  getMemberFlow: async () => {
    const { data } = await api.get("/api/dashboard/member-flow");
    return data;
  },

  // 계정 상태 추이 (최근 7개월)
  getAccountStatusTrend: async () => {
    const { data } = await api.get("/api/dashboard/account-status-trend");
    return data;
  },
};