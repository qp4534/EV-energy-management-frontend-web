// 배터리와 관련된 api를 관리할 예정
// BATTERY_PASSPORT, BATTERY_OFFER, BATTERY_PROPOSALS, BATTERY_DIAGBNOSIS_METRICS와 관련된 api를 관리할 예정
import api from "../api/axios";

// BATTERY_PASSPORT.grade_detail의 4개 값(schema.sql 코멘트 기준)별 안내 문구.
// 백엔드에 판정 사유 필드가 없어(getBatteryDiagnosis의 description이 항상 "") 화면 표시용으로
// 고정 매핑해두고, 실제 필드가 채워지면 그 값을 우선 사용한다.
const GRADE_DETAIL_DESCRIPTIONS = {
  "재사용(EV 재제조)급": "잔여 수명이 충분합니다. EV로 계속 사용 가능.",
  "2차사용(ESS)급": "EV용으로는 부적합하나 ESS(에너지 저장장치)로는 재사용 가능합니다.",
  "재활용(소재회수)급": "재사용이 어려워 소재 회수를 통한 재활용이 필요합니다.",
  "수거·매입(중개)급": "수거 후 매입처를 통한 처리가 필요합니다.",
};

export const batteryService = {
  // CarDetail.jsx(/controller/cars/:id)의 "배터리 여권" 카드 전용.
  // 차량 1대의 BATTERY_PASSPORT를 carId로 조회한다.
  //
  // TEMP: 항상 실제 API 호출. 백엔드 BatteryPassportDto 필드명(manufacturer/batteryType/
  // ratedCapacity/sohScore/chargeCycles/currentTemp/lastInspectedAt/carId 등)이 mock과
  // 완전히 같아서 매핑이 필요 없다. 다만 백엔드엔 "carId로 조회" 엔드포인트가 없어서
  // 목록(/api/battery-passports)을 받아 carId가 일치하는 것을 찾는다 - 지금은 더미 데이터라
  // carId가 매 요청 랜덤이라 거의 항상 못 찾고, 그 경우 첫 번째 항목을 임시로 보여준다.
  // (chargingService.getStationByCarId와 동일한 패턴 - 실제 DB가 연결되면 자동으로 정확해진다)
  getBatteryByCarId: async (carId) => {
    const response = await api.get("/api/battery-passports");
    const batteries = response.data;
    return batteries.find((b) => b.carId === carId) ?? batteries[0] ?? null;
  },

  // BatteryDiagnosis.jsx(/admin/battery "배터리 진단" 탭)에서 쓰는 형태 그대로 반환한다.
  getBatteryDiagnosis: async (batteryId) => {
    const res = await api.get(`/api/battery-passports/${batteryId}`);
    const d = res.data;

    let probabilities = { unusable: 0, reusable: 0, remanufacturable: 0 };
    try {
      probabilities = JSON.parse(d.reuseProbabilities);
    } catch (e) {
      console.error("reuseProbabilities 파싱 실패:", e);
    }

    return {
      grade: d.gradeDetail,
      remainingCycle: d.remainingCycles,
      newCycle: d.totalCycles,
      healthScore: Number(d.sohScore),
      judgement: {
        label: d.gradeDetail,
        description: GRADE_DETAIL_DESCRIPTIONS[d.gradeDetail] ?? "", // TEMP: 백엔드에 판정 사유 필드 없음
        confidence: Number(d.reliabilityScore),
      },
      distribution: [
        { name: "재사용 불가", value: probabilities.unusable },
        { name: "재사용 가능", value: probabilities.reusable },
        { name: "재제조 가능", value: probabilities.remanufacturable },
      ],
    };
  },

  // BatteryDiagnosis.jsx 상단 "차량 선택" 드롭다운 전용 - carId로 고르면 그 차량의
  // batteryId를 찾아 getBatteryDiagnosis에 위임한다(진단 API는 batteryId 기준이라 필요).
  getDiagnosisByCarId: async (carId) => {
    const passport = await batteryService.getBatteryByCarId(carId);
    if (!passport) return null;
    return batteryService.getBatteryDiagnosis(passport.batteryId);
  },

  // BatteryDiagnosis.jsx "배터리 매도 제안서" 탭(ProposalContent) 전용.
  // 이전엔 차량 선택과 무관하게 proposalMock을 그대로 썼음 - 실제로는
  // /api/battery-proposals, /api/battery-diagnosis-metrics 둘 다 이미 있어서
  // carId -> batteryId로 찾아 매칭한다.
  //
  // TEMP: getBatteryByCarId와 동일한 패턴 - "batteryId로 조회" 엔드포인트가
  // 없어서 목록을 받아 batteryId가 일치하는 걸 찾는다. 지금은 carId가 배터리와
  // 무작위로 매칭돼 있어 거의 항상 못 찾고, 그 경우 첫 번째 항목을 임시로 보여준다
  // (실제 FK 연결이 되면 자동으로 정확해진다).
  getProposalByCarId: async (carId) => {
    const passport = await batteryService.getBatteryByCarId(carId);
    if (!passport) return null;
    const batteryId = passport.batteryId;

    const [proposalsRes, metricsRes] = await Promise.all([
      api.get("/api/battery-proposals"),
      api.get("/api/battery-diagnosis-metrics"),
    ]);

    const proposals = proposalsRes.data ?? [];
    const proposal =
      proposals.find((p) => p.batteryId === batteryId) ?? proposals[0] ?? null;
    if (!proposal) return null;

    const metrics = metricsRes.data ?? [];
    const metricsForBattery = metrics
      .filter((m) => m.batteryId === batteryId)
      .sort((a, b) => new Date(b.diagnosedAt) - new Date(a.diagnosedAt)); // 최신 진단 우선
    const metric = metricsForBattery[0] ?? metrics[0] ?? null;

    return {
      price: {
        total: Math.round(Number(proposal.totalPrice) / 10000), // 원 -> 만원
        unitPrice: Math.round(Number(proposal.pricePerKwh)).toLocaleString(),
        negotiationRange: proposal.capacityRange,
        grade: passport.gradeDetail,
        // 특정 낙찰 사례·단가 범위는 배터리마다 다른 검증된 근거가 없어
        // 일반적인 산정 방식만 설명한다(과거 mock처럼 특정 수치를 못박지 않음).
        note: "본 제안가는 배터리 진단 결과에 공개 시장 벤치마크를 결합해 산정한 추정치입니다.",
      },
      healthMetrics: metric
        ? [
            { label: "수명 여유", score: `${metric.remainingLifeScore} / 100` },
            { label: "방전 지속력", score: `${metric.dischargePowerScore} / 100` },
            { label: "충전 건전성", score: `${metric.chargeHealthScore} / 100` },
            { label: "전압 안정성", score: `${metric.voltageStabilityScore} / 100` },
          ]
        : [],
      diagnosisNote:
        "진단 방식 — 충·방전 센서값을 RandomForest 회귀·분류 모델로 분석. " +
        "잔여수명 예측 평균오차 ±11 사이클, 등급 판별 정확도 98.4%.",
      reasons: proposal.suitabilityReason ? [proposal.suitabilityReason] : [],
      cautions: proposal.noticeText ? [proposal.noticeText] : [],
    };
  },

  // BatteryDiagnosis.jsx "배터리 잔존가치/판매처" 탭 전용.
  // 매도 제안서 탭과 같은 문제였음 - valueMock 고정값이라 차량을 바꿔도 안 바뀌었음.
  // /api/battery-offers(BATTERY_OFFERS, rank_order로 매입처 순위 있음)를 실제로 연결한다.
  //
  // TEMP: getProposalByCarId와 동일한 패턴 - batteryId로 조회하는 엔드포인트가 없어
  // 목록에서 필터링한다. 매칭되는 offer가 없으면 상위 3곳으로 대체.
  getOffersByCarId: async (carId) => {
    const passport = await batteryService.getBatteryByCarId(carId);
    if (!passport) return null;
    const batteryId = passport.batteryId;

    const offersRes = await api.get("/api/battery-offers");
    const allOffers = offersRes.data ?? [];

    let offers = allOffers
      .filter((o) => o.batteryId === batteryId)
      .sort((a, b) => (a.rankOrder ?? 999) - (b.rankOrder ?? 999));
    if (offers.length === 0) {
      // 이 배터리엔 매칭되는 offer가 없음(더미데이터 희소) - 대표값으로 상위 3곳만 대체 표시
      offers = [...allOffers]
        .sort((a, b) => Number(b.offeredPrice) - Number(a.offeredPrice))
        .slice(0, 3);
    }
    if (offers.length === 0) return null;

    const toManwon = (won) => Math.round(Number(won) / 10000);
    const top = offers[0];

    return {
      summary: {
        grade: passport.gradeDetail,
        gradeSub: `SOH ${passport.sohScore}% · ${passport.batteryType}`,
        remainingCycle: passport.remainingCycles,
        remainingCycleSub: passport.totalCycles
          ? `(신품 ${Number(passport.totalCycles).toLocaleString()})`
          : null,
        bestOffer: toManwon(top.offeredPrice),
        bestOfferSub: `${top.buyerName} · ${Math.round(Number(top.pricePerKwh)).toLocaleString()} 원/kWh`,
      },
      topBuyers: offers.slice(0, 3).map((o, i) => ({
        rank: o.rankOrder ?? i + 1,
        name: o.buyerName,
        category: o.businessType,
        price: toManwon(o.offeredPrice),
        priceSubtext: `${Math.round(Number(o.pricePerKwh)).toLocaleString()} 원/kWh`,
        gradeLabel: passport.gradeDetail, // offer 단위 등급 필드가 없어 배터리 등급을 재사용
        description: o.description,
      })),
      otherBuyers: offers.slice(3).map((o) => ({
        name: o.buyerName,
        category: o.businessType,
        price: `${toManwon(o.offeredPrice)} 만원`,
      })),
    };
  },
};
