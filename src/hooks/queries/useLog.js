// logService 결과를 컴포넌트에 전달 (LogManage.jsx 전용)
import { useQuery } from "@tanstack/react-query";
import { logService } from "../../services/logService";

// LogManage.jsx의 탭 key ↔ logService 함수 매핑
const LOG_FETCHERS = {
  login: logService.getLoginLogs,
  carChange: logService.getCarChangeLogs,
  userActivity: logService.getUserActivityLogs,
  adminAction: logService.getAdminActionLogs,
};

// 탭 key를 넘기면 해당 탭의 로그를 조회.
// react-query가 탭별로 캐시를 따로 들고 있어서, 한 번 본 탭은 다시 돌아왔을 때
// 재요청 없이 바로 보여줌 (staleTime 지나기 전까지).
export const useLogs = (tabKey) => {
  return useQuery({
    queryKey: ["logs", tabKey],
    queryFn: LOG_FETCHERS[tabKey],
    enabled: !!LOG_FETCHERS[tabKey],
  });
};