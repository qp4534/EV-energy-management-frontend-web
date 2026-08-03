// 시스템과 관련된 api를 관리할 예정
// BATCH_JOBS, EXTERNAL_INTEGRATIONS, NOTIFICATION과 관련된 api를 관리할 예정
import api from "../api/axios";
import {
  MOCK_NOTIFICATION_CHANNELS,
  MOCK_RISK_CHANNEL_MATRIX,
  MOCK_INTEGRATIONS,
  MOCK_BATCH_JOBS,
  MOCK_RESOURCE_USAGE,
  MOCK_DEPLOY_HISTORY,
  MOCK_BACKUPS,
} from "../mocks/systemMock";

const USE_MOCK = true;

const randomHex = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join("");

const randomPercent = (base, spread) =>
  Math.min(99, Math.max(1, base + Math.round((Math.random() - 0.5) * spread)));

export const systemService = {
  // SystemAlertChannel.jsx "채널 활성화" 카드
  getNotificationChannels: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_NOTIFICATION_CHANNELS;
    }
    const response = await api.get("/api/v1/system/notification-channels");
    return response.data;
  },

  updateNotificationChannel: async (key, enabled) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const channel = MOCK_NOTIFICATION_CHANNELS.find((c) => c.key === key);
      if (channel) channel.enabled = enabled;
      return channel;
    }
    const response = await api.patch(`/api/v1/system/notification-channels/${key}`, {
      enabled,
    });
    return response.data;
  },

  // SystemAlertChannel.jsx "위험도별 발송 매트릭스" 카드
  getRiskChannelMatrix: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RISK_CHANNEL_MATRIX;
    }
    const response = await api.get("/api/v1/system/risk-channel-matrix");
    return response.data;
  },

  updateRiskChannelCell: async (level, channelKey, checked) => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const row = MOCK_RISK_CHANNEL_MATRIX.rows.find((r) => r.level === level);
      if (row) row[channelKey] = checked;
      return MOCK_RISK_CHANNEL_MATRIX;
    }
    const response = await api.patch("/api/v1/system/risk-channel-matrix", {
      level,
      channelKey,
      checked,
    });
    return response.data;
  },

  // SystemExternalLink.jsx
  getIntegrations: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_INTEGRATIONS;
    }
    const response = await api.get("/api/v1/system/integrations");
    return response.data;
  },

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

  // SystemBatchJob.jsx
  getBatchJobs: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_BATCH_JOBS;
    }
    const response = await api.get("/api/v1/system/batch-jobs");
    return response.data;
  },

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

  // SystemStatus.jsx
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

  // SystemBackup.jsx
  getBackups: async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_BACKUPS;
    }
    const response = await api.get("/api/v1/system/backups");
    return response.data;
  },
};
