// logService.js에 추가할 부분 (예시)
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
  // LoginManage.jsx "로그인 기록" 탭 (이미 확인함)
  getLoginLogs: async () => {
    const res = await api.get("/api/login-logs");
    return res.data.map((log) => ({
      id: log.logId,
      user: log.userId, // TEMP: User 조인 안 됨
      datetime: log.createdAt ? new Date(log.createdAt).toLocaleString("ko-KR") : "-",
      ip: log.ipAddress,
      device: log.userAgent,
      status: log.status === "SUCCESS" ? "성공" : log.status === "FAILED" ? "실패" : log.status,
      location: log.location,
    }));
  },

  // LogManage.jsx "차량 등록/변경" 탭
  // TEMP: targetType === "CAR" 기준으로 필터링. 실제 값 확인 후 조정 필요.
  // detail JSON 안에 carNumber/owner/changeType/status가 있다고 가정 - DB 연결 후 실제 키 확인 필요.
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
  // TEMP: targetType === "USER"이면서 관리자 작업이 아닌 것으로 추정.
  // "이용자 활동"과 "관리자 작업"을 가르는 명확한 기준(role, actionType 목록 등)은
  // 실제 설계하면서 확정 필요.
  getUserActivityLogs: async () => {
    const logs = await fetchActionLogs();
    return logs
      .filter((log) => log.targetType === "USER")
      .map((log) => {
        const detail = parseDetail(log.detail);
        return {
          id: log.actionId,
          user: log.userId, // TEMP: User 조인 안 됨
          action: log.actionType,
          target: detail.target ?? log.targetType,
          datetime: log.createdAt ? new Date(log.createdAt).toLocaleString("ko-KR") : "-",
        };
      });
  },

  // LogManage.jsx "관리자 작업" 탭
  // TEMP: actionType이 관리 작업류(공지/유저/시스템 등)인 것으로 추정해서 필터링.
  // 정확한 구분 기준은 백엔드 설계 시 확정 필요.
  ADMIN_ACTION_TYPES: ["NOTICE_CREATE", "NOTICE_UPDATE", "NOTICE_DELETE", "USER_UPDATE", "SYSTEM_UPDATE"],
  getAdminActionLogs: async () => {
    const logs = await fetchActionLogs();
    const adminTypes = logService.ADMIN_ACTION_TYPES;
    return logs
      .filter((log) => adminTypes.includes(log.actionType))
      .map((log) => {
        const detail = parseDetail(log.detail);
        return {
          id: log.actionId,
          admin: log.userId, // TEMP: User 조인 안 됨
          action: log.actionType,
          target: detail.title ?? detail.target ?? log.targetType,
          datetime: log.createdAt ? new Date(log.createdAt).toLocaleString("ko-KR") : "-",
        };
    });
  },
};