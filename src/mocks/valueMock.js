export const valueMock = {
  summary: {
    grade: "재사용 가능",
    gradeSub: "SOH 84.2% · NCM",
    remainingCycle: 569,
    remainingCycleSub: "약 3.8년 상당 (ESS 저출력 기준)",
    bestOffer: 811,
    bestOfferSub: "현대글로비스 · 128,793 원/kWh",
  },
  topBuyers: [
    {
      rank: 1,
      name: "현대글로비스",
      category: "폐배터리 회수·유통 (현대차그룹) · 전국",
      price: 811,
      priceSubtext: "126,793 원/kWh",
      gradeLabel: "재사용(EV 재제조)급",
      description:
        "현대차그룹 순환경제 체계로 폐배터리를 수거하고 현대모비스가 재제조합니다. 재제조 가능한 고SOH팩에 가장 높은 값을 기대할 수 있는 경로입니다.",
      tag: "현대글로비스 수거 → 현대모비스 재제조 순환경제 시스템",
    },
    {
      rank: 2,
      name: "지자체 공개입찰 (제주 배터리산업화센터 등)",
      category: "공공 사용후배터리 경쟁입찰 · 제주 등",
      price: 799,
      priceSubtext: "124,844 원/kWh",
      gradeLabel: "재사용(EV 재제조)급",
      description:
        "경쟁입찰이 시황에 따라 예정가의 3~4배까지 형성됩니다. 단, 낙찰가 변동폭이 크고 입찰 일정이 정해져 있습니다.",
      tag: "니로EV 64kWh 785만원 낙찰 사례 (예정가의 3.4배)",
    },
    {
      rank: 3,
      name: "에너지머티리얼즈 (GS건설 자회사)",
      category: "재사용 + 재활용 통합 · 경북 포항",
      price: 782,
      priceSubtext: "122,190 원/kWh",
      gradeLabel: "재사용(EV 재제조)급",
      description:
        "수거·재사용과 블랙파우더 추출(재활용)을 함께 하는 곳이라, 등급이 애매하거나 혼합 물량이어도 한 곳에서 처리할 수 있습니다.",
      tag: "리튬이온 배터리 수거·재사용 + 블랙파우더 추출, 연 2만톤 목표",
    },
  ],
  otherBuyers: [
    { name: "피엠그로우", category: "재사용 팩 인증", price: "771 만원" },
    { name: "성일하이텍", category: "재활용 원료 추출", price: "758 만원" },
    { name: "영화테크", category: "ESS 재조립", price: "744 만원" },
    { name: "한국환경공단 거점센터", category: "공공 보관·평가", price: "730 만원" },
    { name: "기타 6곳", category: "", price: "690 ~ 715 만원" },
  ],
};