// 시스템과 관련된 api를 관리할 예정
// BATCH_JOBS, EXTERNAL_INTEGRATIONS, NOTIFICATION과 관련된 api를 관리할 예정
import api from "../api/axios";
import { MOCK_BACKUPS } from "../mocks/systemMock";

// 알림 채널/매트릭스/연동/배치실행/리소스는 실제 API 연결 완료.
// 백업만 별도로 기록해두는 곳(테이블)이 없어서 mock 유지.
const USE_MOCK = true;

export const systemService = {
  // SystemAlertChannel.jsx "채널 활성화" 카드
  // TEMP: USE_MOCK과 무관하게 항상 실제 API 호출.
  // 백엔드: [{ channelId, channelName, isActive, updatedAt }]
  // 프론트가 원하는 형태: [{ key, label, enabled, desc }]로 변환해서 반환
  getNotificationChannels: async () => {
    const res = await api.get("/api/notification-channels");
    return res.data.map((ch) => ({
      key: ch.channelId,
      label: ch.channelName,
      enabled: ch.isActive,
      desc: "", // 백엔드에 설명 필드가 없어 임시 공백
    }));
  },

  updateNotificationChannel: async (key, enabled) => {
    const res = await api.put(`/api/notification-channels/${key}`, {
      channelId: key,
      isActive: enabled,
    });
    return res.data;
  },

  // SystemAlertChannel.jsx "위험도별 발송 매트릭스" 카드
  // TEMP: USE_MOCK과 무관하게 항상 실제 API 호출.
  // 백엔드: [{ matrixId, riskLevel, isEnabled, channelId }] (평평한 리스트)
  // 프론트가 원하는 형태: { channels, rows } 표 형태로 변환
  getRiskChannelMatrix: async () => {
    const res = await api.get("/api/notification-matrix");
    const channelKeys = [...new Set(res.data.map((m) => m.channelId))];
    const channels = channelKeys.map((key) => ({ key, label: key }));

    const levels = [...new Set(res.data.map((m) => m.riskLevel))];
    const rows = levels.map((level) => {
      const row = { level };
      res.data
        .filter((m) => m.riskLevel === level)
        .forEach((m) => {
          row[m.channelId] = { matrixId: m.matrixId, enabled: Boolean(m.isEnabled) };
        });
      return row;
    });

    return { channels, rows };
  },

  // "긴급" 등급은 백엔드가 무조건 켜짐으로 강제 저장하도록 막아둠
  updateRiskChannelCell: async (matrixId, level, channelKey, checked) => {
    const res = await api.put(`/api/notification-matrix/${matrixId}`, {
      riskLevel: level,
      isEnabled: checked,
      channelId: channelKey,
    });
    return res.data;
  },

  // SystemExternalLink.jsx - 실제 API 연결 완료
  getIntegrations: async () => {
    const res = await api.get("/api/external-integrations");
    return res.data.map((item) => ({
      id: item.integrationId,
      name: item.name,
      desc: item.description,
      maskedKey: item.apiKey,
    }));
  },

  // 연동키 재발급. 백엔드 실제 구현 완료 -> 항상 실제 API 호출.
  reissueIntegrationKey: async (id) => {
    const response = await api.post(`/api/external-integrations/${id}/reissue`);
    return {
      id: response.data.integrationId,
      name: response.data.name,
      desc: response.data.description,
      maskedKey: response.data.apiKey, // 재발급 직후 응답이라 원본 키 (이번 1회만)
    };
  },

  // SystemBatchJob.jsx - 실제 API 연결 완료
  getBatchJobs: async () => {
    const res = await api.get("/api/batch-jobs");
    return res.data.map((job) => ({
      id: job.jobId,
      name: job.jobName,
      cycle: job.cycle,
      // 백엔드: "정상"/"오류" 같은 한글 문자열 -> StatusBadge가 기대하는 영문 코드로 변환
      status: job.status === "정상" ? "success" : "error",
      lastRun: job.lastRunAt
        ? new Date(job.lastRunAt).toLocaleString("ko-KR")
        : "-",
      lastRunResult: job.status ?? "-", // TEMP: 백엔드에 별도 필드 없어 status로 임시 대체
      nextRun: job.nextRunAt
        ? new Date(job.nextRunAt).toLocaleString("ko-KR")
        : "-",
    }));
  },

  // 수동 실행 - 실제 API 연결 완료
  runBatchJob: async (id) => {
    const response = await api.post(`/api/batch-jobs/${id}/run`);
    const job = response.data;
    return {
      id: job.jobId,
      name: job.jobName,
      cycle: job.cycle,
      status: job.status === "정상" ? "success" : "error",
      lastRun: job.lastRunAt ? new Date(job.lastRunAt).toLocaleString("ko-KR") : "-",
      lastRunResult: job.status ?? "-",
      nextRun: job.nextRunAt ? new Date(job.nextRunAt).toLocaleString("ko-KR") : "-",
    };
  },

  // 리소스 사용률은 저장된 값이 아니라, 호출 시점의 서버 상태를 그대로 조회.
  getResourceUsage: async () => {
    const response = await api.get("/api/system/monitor/resource-usage");
    return response.data;
  },

  refreshResourceUsage: async () => {
    const response = await api.get("/api/system/monitor/resource-usage");
    return response.data;
  },

  // SystemBackup.jsx - 백엔드 미구현, mock 유지
  getBackups: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_BACKUPS;
    }
    const response = await api.get("/api/v1/system/backups");
    return response.data;
  },
};