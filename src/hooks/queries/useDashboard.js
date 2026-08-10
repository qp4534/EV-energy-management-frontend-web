// dashboardService 결과를 컴포넌트에 전달 (AdministratorMain.jsx 전용)
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboardService";

export const useCarModelDistribution = () => {
  return useQuery({
    queryKey: ["dashboard", "carModelDistribution"],
    queryFn: dashboardService.getCarModelDistribution,
  });
};

export const useUserRoleDistribution = () => {
  return useQuery({
    queryKey: ["dashboard", "userRoleDistribution"],
    queryFn: dashboardService.getUserRoleDistribution,
  });
};

export const useMemberFlow = () => {
  return useQuery({
    queryKey: ["dashboard", "memberFlow"],
    queryFn: dashboardService.getMemberFlow,
  });
};

export const useAccountStatusTrend = () => {
  return useQuery({
    queryKey: ["dashboard", "accountStatusTrend"],
    queryFn: dashboardService.getAccountStatusTrend,
  });
};