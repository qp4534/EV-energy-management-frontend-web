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
    // 실패해도 화면엔 아무 표시가 없어서(호출부인 AiReportDetail.jsx도 에러를 안 잡음) NEW
    // 뱃지가 왜 안 없어지는지 콘솔로도 전혀 확인할 수 없었다 - 최소한 콘솔에는 남긴다.
    onError: (error, reportId) => {
      console.error(`AI 보고서(${reportId}) 읽음 처리 실패:`, error);
    },
  });
};

// AI 보고서 상세의 "고객 알림 발송" 액션 - 해당 차주에게 앱 알림을 (다시) 보낸다.
export const useNotifyCustomer = () => {
  return useMutation({
    mutationFn: (reportId) => reportService.notifyCustomer(reportId),
  });
};

// "긴급출동 배차" 액션 - 해당 차주에게만 긴급 알림을 보내고 ACTION_LOGS에 기록한다.
export const useDispatchEmergency = () => {
  return useMutation({
    mutationFn: (reportId) => reportService.dispatchEmergency(reportId),
  });
};
