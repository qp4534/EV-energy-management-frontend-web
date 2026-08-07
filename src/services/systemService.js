// 시스템과 관련된 api를 관리할 예정
// BATCH_JOBS, EXTERNAL_INTEGRATIONS, NOTIFICATION과 관련된 api를 관리할 예정
import api from "../api/axios";
import {
  MOCK_INTEGRATIONS,
  MOCK_BATCH_JOBS,
  MOCK_RESOURCE_USAGE,
  MOCK_DEPLOY_HISTORY,
  MOCK_BACKUPS,
} from "../mocks/systemMock";

// 알림 채널/매트릭스는 실제 API 연결 완료 -> USE_MOCK과 무관하게 항상 실제 호출
// 나머지(연동, 배치, 상태, 백업)는 아직 백엔드 미구현 -> mock 유지
const USE_MOCK = true;

const randomHex = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join("");

const randomPercent = (base, spread) =>
  Math.min(99, Math.max(1, base + Math.round((Math.random() - 0.5) * spread)));

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
  //
  // 알려진 이슈 (백엔드 확인 요청 필요):
  // 1) NotificationMatrixDto.isEnabled 타입이 UUID로 되어있음 -> Boolean으로 수정 필요
  // 2) NotificationMatrixDto.channelId 타입이 UUID로 되어있음
  //    -> NotificationChannelDto.channelId(String, "SLACK"/"SMS")와 형식이 달라서
  //       두 데이터를 매칭할 수 없음 -> String으로 통일 필요
  // 두 이슈 해결 전까지 매트릭스는 정상 표시/수정이 불가능함.
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
          row[m.channelId] = Boolean(m.isEnabled);
        });
      return row;
    });

    return { channels, rows };
  },

  // TEMP: matrixId가 있어야 특정 셀을 수정할 수 있는데 (level, channelKey)만으로는
  // 특정이 불가능함. 백엔드에 matrixId 조회용 엔드포인트가 추가되거나
  // channelId가 String으로 바뀌어 조합 키로 특정 가능해지기 전까지는 동작하지 않음.
  updateRiskChannelCell: async (level, channelKey, checked) => {
    console.warn("updateRiskChannelCell: matrixId 필요, 백엔드 확인 필요 (아직 미구현)");
    throw new Error("위험도별 발송 매트릭스 수정은 아직 지원되지 않습니다.");
  },

  // SystemExternalLink.jsx - 백엔드 미구현, mock 유지
  getIntegrations: async () => {
    const res = await api.get("/api/external-integrations");
    return res.data.map((item) => ({
      id: item.integrationId,
      name: item.name,
      desc: item.description,
      maskedKey: item.apiKey,
    }));
  },

  // 현재 mock 사용 추후 실제 API 연결 필요
  reissueIntegrationKey: async (id) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const integration = MOCK_INTEGRATIONS.find((i) => i.id === id);
      if (integration) integration.maskedKey = `iot_live_••••••••${randomHex(4)}`;
      return integration;
    }
    const response = await api.post(`/api/v1/system/integrations/${id}/reissue`);
    return response.data;
  },

  // SystemBatchJob.jsx - 백엔드 미구현, mock 유지
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

  // 백엔드에 수동 실행 전용 엔드포인트 없음, 미구현 -> 추후 구현
  runBatchJob: async (id) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const job = MOCK_BATCH_JOBS.find((j) => j.id === id);
      if (job) {
        job.status = "success";
        job.lastRunResult = "성공";
        job.lastRun = "방금 전";
      }
      return job;
    }
    const response = await api.post(`/api/v1/system/batch-jobs/${id}/run`);
    return response.data;
  },

  // SystemStatus.jsx - 백엔드 미구현, mock 유지
  getSystemStatus: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { resourceUsage: MOCK_RESOURCE_USAGE, deployHistory: MOCK_DEPLOY_HISTORY };
    }
    const response = await api.get("/api/v1/system/status");
    return response.data;
  },

  refreshResourceUsage: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      MOCK_RESOURCE_USAGE.forEach((item) => {
        item.percent = randomPercent(item.percent, 20);
      });
      return MOCK_RESOURCE_USAGE;
    }
    const response = await api.get("/api/v1/system/status/resource-usage");
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