// logService.js
import api from "../api/axios";

const STATUS_MAP = {
  success: "성공",
  fail: "실패",
  approved: "승인",
  rejected: "반려",
};

// 로그인 기록 "기기/브라우저" 컬럼용 - 원본 User-Agent 문자열을 그대로 보여주면 너무 길고
// 읽기 힘들어서, OS/브라우저만 뽑아 "Windows · Chrome" 형태로 요약한다. 정교한 UA 파서
// 라이브러리를 새로 추가하는 대신 이 화면에 필요한 만큼만 간단히 매칭한다.
const parseUserAgent = (ua) => {
  if (!ua) return "-";

  let os = "알 수 없음";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  // 순서 중요: Edge/Chrome 둘 다 UA에 "Chrome/"이 들어있어서 Edge를 먼저 걸러내야 함
  let browser = "알 수 없음";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\//i.test(ua)) browser = "Opera";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua)) browser = "Safari";

  return `${os} · ${browser}`;
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
      device: parseUserAgent(log.userAgent),
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