// 통계 / 리포트 조회 페이지 - '이용자' 탭 mock 데이터

export const dateRangeLabel = "2025.02 ~ 2026.02";

// 월별 가입자 추이 (LineTrendChart: 단일 지표 꺾은선)
export const memberTrend = [
  { month: "3월", 가입자수: 620 },
  { month: "4월", 가입자수: 638 },
  { month: "5월", 가입자수: 660 },
  { month: "6월", 가입자수: 679 },
  { month: "7월", 가입자수: 706 },
  { month: "8월", 가입자수: 730 },
  { month: "9월", 가입자수: 759 },
];

// 유형별 분포 (DonutStat: 관리자 / 관제자 / 차주(이용자) 각 인원)
export const userTypeDistribution = [
  { name: "관리자", value: 3, color: "#FFE88A" },
  { name: "관제자", value: 6, color: "#FF8D72" },
  { name: "차주", value: 7, color: "#A8F56B" },
];

// 하단 요약 통계 카드 3종
export const summaryStats = {
  totalUsers: 759,
  totalUsersDelta: 29,
  activeRate: 87,
  activeRateDelta: 4,
  newUsersThisMonth: 29,
  newUsersGeneral: 21,
  newUsersController: 8,
};

// 통계 / 리포트 조회 페이지 - '배터리' 탭 mock 데이터
import { MOCK_CAR_STATS } from "./carMock";
// 상단 요약 통계 카드 3종
export const fireSummaryStats = {
  alertCount: 18, // 이번 달 알림 발생 건수
  alertCountDelta: -4, // 전월 대비 증감(건)
  responseRate: 94.4, // 대응율(%)
  responseRateDelta: 2.1, // 전월 대비 증감(%p)
  avgResponseMinutes: 6, // 평균 대응 시간(분)
  avgResponseMinutesDelta: -1.5, // 전월 대비 증감(분)
};

// 현재 위험등급별 차량 수 (CarList/StatCardList와 동일한 MOCK_CAR_STATS를 그대로 사용해 수치 일관성 유지)
export const fireRiskLevels = [
  { key: "normal", label: "양호", count: MOCK_CAR_STATS.normal },
  { key: "caution", label: "보통", count: MOCK_CAR_STATS.caution },
  { key: "warning", label: "위험", count: MOCK_CAR_STATS.warning },
  { key: "emergency", label: "긴급", count: MOCK_CAR_STATS.emergency },
];

export const fireRiskTotal = MOCK_CAR_STATS.total;
 
// 통계 / 리포트 조회 페이지 - '배터리' 탭 mock 데이터
// 월별 진단 건수 (LineTrendChart)
export const batteryDiagnosisTrend = [
  { month: "3월", 진단건수: 142 },
  { month: "4월", 진단건수: 158 },
  { month: "5월", 진단건수: 171 },
  { month: "6월", 진단건수: 165 },
  { month: "7월", 진단건수: 189 },
  { month: "8월", 진단건수: 203 },
  { month: "9월", 진단건수: 196 },
];
 
// 평균 SOH 추이 (LineTrendChart, %)
export const batterySohTrend = [
  { month: "3월", 평균SOH: 88.4 },
  { month: "4월", 평균SOH: 87.9 },
  { month: "5월", 평균SOH: 87.5 },
  { month: "6월", 평균SOH: 86.8 },
  { month: "7월", 평균SOH: 86.3 },
  { month: "8월", 평균SOH: 85.9 },
  { month: "9월", 평균SOH: 85.4 },
];
 
// 배터리 등급별 분포 (RiskLevelCard의 색상 타입을 그대로 재사용: normal=양호/caution=노후/emergency=수명말기)
export const batteryGradeDistribution = [
  { key: "normal", label: "양호", count: 612 },
  { key: "caution", label: "노후", count: 118 },
  { key: "emergency", label: "수명말기", count: 34 },
];
 
export const batteryGradeTotal = batteryGradeDistribution.reduce(
  (sum, item) => sum + item.count,
  0
);
 
// 배터리 처리 - 이번 달 처리 건수 3종
export const batteryProcessingStats = [
  { key: "reuse", label: "이번 달 재사용 처리", count: 24, unit: "건" },
  { key: "recycle", label: "이번 달 재활용 처리", count: 11, unit: "건" },
  { key: "dispose", label: "이번 달 폐기 처리", count: 5, unit: "건" },
];
 
// 최근 처리 이력 (DataTable)
export const recentBatteryProcessing = [
  { batteryId: "BT-2091", grade: "A등급", processType: "재사용", processedAt: "2026-07-13" },
  { batteryId: "BT-2088", grade: "B등급", processType: "재활용", processedAt: "2026-07-12" },
  { batteryId: "BT-2085", grade: "A등급", processType: "재사용", processedAt: "2026-07-11" },
  { batteryId: "BT-2079", grade: "C등급", processType: "폐기", processedAt: "2026-07-10" },
  { batteryId: "BT-2074", grade: "B등급", processType: "재활용", processedAt: "2026-07-09" },
  { batteryId: "BT-2071", grade: "A등급", processType: "재사용", processedAt: "2026-07-08" },
];