import UserCard from "../../components/administrator/main/UserCard";
import NoticeCard from "../../components/administrator/main/NoticeCard";
import FlowChartCard from "../../components/administrator/main/FlowChartCard";
import LoadingIndicator from "@/components/common/LoadingIndicator";

import { useNotices } from "../../hooks/queries/useNotice";
import {
  useMemberFlow,
  useAccountStatusTrend,
  useCarModelDistribution,
  useUserRoleDistribution,
} from "../../hooks/queries/useDashboard";

import "../../styles/administrator/Administrator.css";

export default function AdministratorMain() {
  const { data: notices, isLoading: isNoticesLoading } = useNotices();
  const { data: memberFlow, isLoading: isMemberFlowLoading } = useMemberFlow();
  const { data: accountFlow, isLoading: isAccountFlowLoading } = useAccountStatusTrend();
  const { isLoading: isCarModelLoading } = useCarModelDistribution();
  const { isLoading: isUserRoleLoading } = useUserRoleDistribution();

  // ControllerMain과 동일하게, 카드별 개별 스피너 대신 초기 로딩(isLoading)만
  // 한 번에 묶어서 페이지 단위로 보여준다.
  const isDashboardLoading =
    isNoticesLoading ||
    isMemberFlowLoading ||
    isAccountFlowLoading ||
    isCarModelLoading ||
    isUserRoleLoading;

  if (isDashboardLoading) {
    return (
      <div className="dashboard-page">
        <h2>관리자 메인 페이지</h2>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingIndicator size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h2>관리자 메인 페이지</h2>

      <div className="dashboard-body">
        <div className="content-grid">
          <UserCard title="이용자" />

          <NoticeCard
            title="공지 사항"
            notices={notices ?? []}
            limit={5}
            importantOnly={true}
            expandTo="/admin/notices"
          />

          <FlowChartCard
            title="신규 가입자 / 탈퇴자"
            data={memberFlow ?? []}
            seriesA="joined"
            seriesB="withdrawn"
            colorA="#6a91c7"
            colorB="#e69a55"
          />

          <FlowChartCard
            title="계정 상태 추이"
            data={accountFlow ?? []}
            seriesA="activeCount"
            seriesB="lockedCount"
            colorA="#6a91c7"
            colorB="#e46f61"
          />
        </div>
      </div>
    </div>
  );
}