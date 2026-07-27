// AI 분석 리포트 Mock Data
export const MOCK_AI_REPORTS = [
  {
    reportId: "rep-001",
    title: "2026년 7월 배터리 종합 상태 분석 월간 보고서",
    reportType: "월간보고서", // 월간보고서, 이상보고서
    createdAt: "2026-07-01T00:00:00Z",
    cid2: "car-uuid-001",
    anomalyId: null,
    reportData: {
      summary:
        "전반적으로 배터리 잔여 수명이 안정적이며, 열화 진행 속도가 연간 1.2% 수준으로 양호함.",
      healthScore: 92,
      recommendation: "급속 충전 비율을 30% 이하로 유지하는 것을 권장합니다.",
      chartData: {
        monthlySoh: [98.1, 96.5, 95.0, 93.8, 92.4],
        tempDistribution: { normal: 85, warning: 12, critical: 3 },
      },
    },
  },
  {
    reportId: "rep-002",
    title: "[이상 진단] 차량(123가 4567) 온도 급증 관련 AI 분석 보고서",
    reportType: "이상보고서",
    createdAt: "2026-07-27T10:20:00Z",
    cid2: "car-uuid-001",
    anomalyId: "a1b2c3d4-0001-uuid",
    reportData: {
      summary: "급속 충전 중 3번 모듈 주변 국소 열화상 온도 급증 감지.",
      causeAnalysis: "충전 핀 접촉 불량 또는 냉각팬 작동 지연 가능성 높음.",
      actionRequired: "즉시 충전 중단 및 BMS 센서 연결부 물리 점검 필요.",
    },
  },
];
