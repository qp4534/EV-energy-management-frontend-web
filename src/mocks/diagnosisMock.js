export const diagnosisMock = {
  grade: "재사용 가능",
  remainingCycle: 569,
  newCycle: 1134,
  healthScore: 50.2,
  judgement: {
    label: "재사용(EV 재제조)급",
    description: "잔여 수명이 충분합니다. EV로 계속 사용 가능.",
    confidence: 100.0,
  },
  distribution: [
    { name: "재사용 불가", value: 0.05 },
    { name: "재사용 가능", value: 0.92 },
    { name: "재제조 가능", value: 0.06 },
  ],
};