import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";

// carId를 안 넘기면 전체 차량 보고서(AiReportList), 넘기면 특정 차량 보고서 목록 페이지에서도
// 그대로 재사용 가능. params 예) { carId, page, pageSize, search, reportType, dateFrom, dateTo }
export const useReportList = (params) => {
  return useQuery({
    queryKey: ["reportList", params],
    queryFn: () => reportService.getReportList(params),
    keepPreviousData: true,
  });
};

// 보고서 상세 페이지(AiReportDetail.jsx)에서 단건 조회할 때 사용
export const useReportDetail = (reportId) => {
  return useQuery({
    queryKey: ["reportDetail", reportId],
    queryFn: () => reportService.getReportDetail(reportId),
    enabled: !!reportId,
  });
};

// 보고서 상세 페이지에서 "열람했다"고 표시할 때 사용 (AiReportDetail.jsx에서 마운트 시 호출).
// 성공하면 목록 쿼리와 이 보고서의 상세 쿼리를 모두 무효화해서 NEW 뱃지가 자동으로 갱신되게 한다.
export const useMarkReportAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId) => reportService.markReportAsRead(reportId),
    onSuccess: (_, reportId) => {
      queryClient.invalidateQueries({ queryKey: ["reportList"] });
      queryClient.invalidateQueries({ queryKey: ["reportDetail", reportId] });
    },
  });
};
