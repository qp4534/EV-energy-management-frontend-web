// statsReportService 결과를 컴포넌트에 전달 (StatsReport.jsx 전용)
import { useQuery } from "@tanstack/react-query";
import { statsReportService } from "../../services/statsReportService";

// "이용자" 탭
export const useUserTypeDistribution = () => {
  return useQuery({
    queryKey: ["statsReport", "userTypeDistribution"],
    queryFn: statsReportService.getUserTypeDistribution,
  });
};

export const useMemberTrend = () => {
  return useQuery({
    queryKey: ["statsReport", "memberTrend"],
    queryFn: statsReportService.getMemberTrend,
  });
};

export const useUserSummaryStats = () => {
  return useQuery({
    queryKey: ["statsReport", "userSummaryStats"],
    queryFn: statsReportService.getUserSummaryStats,
  });
};

// "배터리 진단" 탭
export const useBatteryDiagnosisTrend = () => {
  return useQuery({
    queryKey: ["statsReport", "batteryDiagnosisTrend"],
    queryFn: statsReportService.getBatteryDiagnosisTrend,
  });
};

export const useBatterySohTrend = () => {
  return useQuery({
    queryKey: ["statsReport", "batterySohTrend"],
    queryFn: statsReportService.getBatterySohTrend,
  });
};

export const useBatteryGradeDistribution = () => {
  return useQuery({
    queryKey: ["statsReport", "batteryGradeDistribution"],
    queryFn: statsReportService.getBatteryGradeDistribution,
  });
};

export const useBatteryMetricAverage = () => {
  return useQuery({
    queryKey: ["statsReport", "batteryMetricAverage"],
    queryFn: statsReportService.getBatteryMetricAverage,
  });
};

export const useRecentDiagnoses = (limit = 6) => {
  return useQuery({
    queryKey: ["statsReport", "recentDiagnoses", limit],
    queryFn: () => statsReportService.getRecentDiagnoses(limit),
  });
};

// "화재 예방" 탭
export const useVehicleRiskOverview = () => {
  return useQuery({
    queryKey: ["statsReport", "vehicleRiskOverview"],
    queryFn: statsReportService.getVehicleRiskOverview,
  });
};

export const useFireSummaryStats = () => {
  return useQuery({
    queryKey: ["statsReport", "fireSummaryStats"],
    queryFn: statsReportService.getFireSummaryStats,
  });
};

export const useAlertTrend = (months = 6) => {
  return useQuery({
    queryKey: ["statsReport", "alertTrend", months],
    queryFn: () => statsReportService.getAlertTrend(months),
  });
};