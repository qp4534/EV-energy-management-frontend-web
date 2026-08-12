// logService.js
import api from "../api/axios";

const STATUS_MAP = {
  success: "성공",
  fail: "실패",
  approved: "승인",
  rejected: "반려",
};

// detail은 JSON 문자열이라 안전하게 파싱, 실패하면 빈 객체
const parseDetail = (detail) => {
  try {
    return detail ? JSON.parse(detail) : {};
  } catch (e) {
    console.error("action log detail 파싱 실패:", e);
    return {};
  }
};

const fetchActionLogs = async () => {
  const res = await api.get("/api/action-logs");
  return res.data;
};

export const logService = {
  // LoginManage.jsx "로그인 기록" 탭
  getLoginLogs: async () => {
    const res = await api.get("/api/login-logs");
    return res.data.map((log) => ({
      id: log.logId,
      user: log.userName || log.userId, // 백엔드에서 User 조인 완료. 탈퇴 등으로 못 찾으면 UUID로 폴백
      datetime: log.createdAt ? new Date(log.createdAt).toLocaleString("ko-KR") : "-",
      ip: log.ipAddress,
      device: log.userAgent,
      status: log.status === "SUCCESS" ? "성공" : log.status === "FAILED" ? "실패" : log.status,
      location: log.location,
    }));
  },

  // LogManage.jsx "차량 등록/변경" 탭
  getCarChangeLogs: async () => {
    const logs = await fetchActionLogs();
    return logs
      .filter((log) => log.targetType === "CAR")
      .map((log) => {
        const detail = parseDetail(log.detail);
        return {
          id: log.actionId,
          carNumber: detail.carNumber ?? "-",
          owner: detail.owner ?? "-",
          changeType: detail.changeType ?? log.actionType,
          datetime: log.createdAt ? new Date(log.createdAt).toLocaleString("ko-KR") : "-",
          status: STATUS_MAP[detail.result] ?? detail.result ?? "-",
        };
      });
  },

  // LogManage.jsx "이용자 활동" 탭
  getUserActivityLogs: async () => {
    const logs = await fetchActionLogs();
    return logs
      .filter((log) => log.targetType === "USER")
      .map((log) => {
        const detail = parseDetail(log.detail);
        return {
          id: log.actionId,
          user: log.userName || log.userId, // 백엔드에서 User 조인 완료. 탈퇴 등으로 못 찾으면 UUID로 폴백
          action: log.actionType,
          target: detail.target ?? log.targetType,
          datetime: log.createdAt ? new Date(log.createdAt).toLocaleString("ko-KR") : "-",
        };
      });
  },

  // LogManage.jsx "관리자 작업" 탭
  // 실제 관리자 전용 작업들 (본인 계정 셀프서비스가 아니라, 남/시스템에 영향을 주는 작업)
  ADMIN_ACTION_TYPES: [
    "USER_ROLE_UPDATE",
    "USER_DELETE",
    "NOTICE_CREATE",
    "NOTICE_UPDATE",
    "NOTICE_DELETE",
    "NOTIFICATION_CHANNEL_UPDATE",
    "NOTIFICATION_MATRIX_UPDATE",
    "INTEGRATION_KEY_REISSUE",
  ],
  getAdminActionLogs: async () => {
    const logs = await fetchActionLogs();
    const adminTypes = logService.ADMIN_ACTION_TYPES;
    return logs
      .filter((log) => adminTypes.includes(log.actionType))
      .map((log) => {
        const detail = parseDetail(log.detail);
        return {
          id: log.actionId,
          admin: log.userName || log.userId, // 백엔드에서 User 조인 완료. 탈퇴 등으로 못 찾으면 UUID로 폴백
          action: log.actionType,
          target: detail.title ?? detail.target ?? log.targetType,
          datetime: log.createdAt ? new Date(log.createdAt).toLocaleString("ko-KR") : "-",
        };
    });
  },
};