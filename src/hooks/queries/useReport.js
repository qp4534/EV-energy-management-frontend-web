// reportService 결과를 컴포넌트에 전달
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";

export const useReportList = (params) => {
  return useQuery({
    queryKey: ["reportList", params],
    queryFn: () => reportService.getReportList(params),
    keepPreviousData: true,
  });
};

export const useMarkReportAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId) => reportService.markReportAsRead(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportList"] });
    },
  });
};
