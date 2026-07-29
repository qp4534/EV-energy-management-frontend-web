import UserCard from "../components/administrator/cards/UserCard";
import NoticeCard from "../components/administrator/cards/NoticeCard";
import FlowChartCard from "../components/administrator/cards/FlowChartCard";

// 1. mock 데이터 파일 import 하기
import {
  userData,
  staffData,
  accountStatusData,
  memberFlow,
} from "../mocks/dashboard";

import { MOCK_NOTICES } from "../mocks/noticeMock";

import "../styles/administrator/Administrator.css";

export default function AdministratorMain() {
  // 2. 혹시 자식 컴포넌트(UserCard 등)에서 ownerData를 찾을 수 있으므로 기본값 선언
  const ownerData = [
  {
    name: "아이오닉5",
    value: 5,
    color: "#A8F56B",
  },
  {
    name: "넥쏘",
    value: 2,
    color: "#527E5B",
  },
];

const operatorData = [
  {
    name: "관리자",
    value: 3,
    color: "#FFE88A",
  },
  {
    name: "관제자",
    value: 6,
    color: "#FF8D72",
  },
];

  const accountFlow = [
    { month: "1월", 정상계정: 32, 잠금계정: 1 },
    { month: "2월", 정상계정: 34, 잠금계정: 1 },
    { month: "3월", 정상계정: 35, 잠금계정: 2 },
    { month: "4월", 정상계정: 37, 잠금계정: 1 },
    { month: "5월", 정상계정: 38, 잠금계정: 2 },
    { month: "6월", 정상계정: 39, 잠금계정: 1 },
    { month: "7월", 정상계정: 38, 잠금계정: 2 },
  ];

  return (
    <div className="dashboard-page">
      <h2>관리자 메인 페이지</h2>

      <div className="dashboard-body">
        <div className="content-grid">
          <UserCard
            title="이용자"
            ownerData={ownerData}
            operatorData={operatorData}
          />

          <NoticeCard 
            title="공지 사항"
            notices={MOCK_NOTICES}
            limit={5}
            importantOnly={true}
          />

          <FlowChartCard
            title="신규 가입자 / 탈퇴자"
            data={memberFlow}
            seriesA="joined"
            seriesB="withdrawn"
            colorA="#6a91c7"
            colorB="#e69a55"
          />

          <FlowChartCard
            title="계정 상태 추이"
            data={accountFlow}
            seriesA="정상계정"
            seriesB="잠금계정"
            colorA="#6a91c7"
            colorB="#e46f61"
          />
        </div>
      </div>
    </div>
  );
}