// systemService 결과를 컴포넌트에 전달
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { systemService } from "@/services/systemService";

// SystemAlertChannel.jsx "채널 활성화" 카드
export const useNotificationChannels = () => {
  return useQuery({
    queryKey: ["notificationChannels"],
    queryFn: systemService.getNotificationChannels,
  });
};

export const useUpdateNotificationChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, enabled }) =>
      systemService.updateNotificationChannel(key, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationChannels"] });
    },
  });
};

// SystemAlertChannel.jsx "위험도별 발송 매트릭스" 카드
export const useRiskChannelMatrix = () => {
  return useQuery({
    queryKey: ["riskChannelMatrix"],
    queryFn: systemService.getRiskChannelMatrix,
  });
};

export const useUpdateRiskChannelCell = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ matrixId, level, channelKey, checked }) =>
      systemService.updateRiskChannelCell(matrixId, level, channelKey, checked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riskChannelMatrix"] });
    },
  });
};

// SystemExternalLink.jsx
export const useIntegrations = () => {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: systemService.getIntegrations,
  });
};

export const useReissueIntegrationKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => systemService.reissueIntegrationKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
};

// SystemBatchJob.jsx
export const useBatchJobs = () => {
  return useQuery({
    queryKey: ["batchJobs"],
    queryFn: systemService.getBatchJobs,
  });
};

export const useRunBatchJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => systemService.runBatchJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batchJobs"] });
    },
  });
};

// SystemStatus.jsx
// 배포 이력은 저장해두는 곳(테이블)이 없어서 제외. 리소스 사용률만 실시간 조회.
export const useResourceUsage = () => {
  return useQuery({
    queryKey: ["resourceUsage"],
    queryFn: systemService.getResourceUsage,
  });
};

export const useRefreshResourceUsage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: systemService.refreshResourceUsage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resourceUsage"] });
    },
  });
};

// SystemBackup.jsx
export const useBackups = () => {
  return useQuery({
    queryKey: ["backups"],
    queryFn: systemService.getBackups,
  });
};