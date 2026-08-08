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
      // PDF(/report/pdf/full)는 "1등급"/"2등급"/"3등급" 형식을 요구한다 - 화면 표시용
      // grade(gradeDetail, 예: "재사용(EV 재제조)급")와는 다른 값이라 따로 둔다.
      gradeLevel: d.batteryLevel ? `${d.batteryLevel}등급` : null,
      capacityKwh: Number(d.ratedCapacity) || null,
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

  // healthMetrics(0~100, "83 / 100" 형태 문자열)를 rul-diagnosis가 기대하는 0~1 지표로
  // 변환한다. 라벨은 batteryService.getProposalByCarId가 항상 이 4개 이름으로 내려준다.
  _INDICATOR_KEY_BY_LABEL: {
    "수명 여유": "life",
    "방전 지속력": "capacity",
    "충전 건전성": "charge",
    "전압 안정성": "stability",
  },

  // "배터리 매도 제안서" 탭의 PDF Download 버튼 전용.
  // 화면에 이미 표시된(=이미 계산되어 저장된) 진단 결과를 백엔드(/api/battery-proposals/pdf)에
  // 넘기면, 백엔드가 rul-diagnosis의 /report/pdf/full을 호출한다 - 원본 센서값을 다시 돌리진
  // 않지만, 매입처 매칭(estimate_offers)·경제성 계산(economics.compute)까지 포함된 정식
  // 문서를 그대로 받는다. (이전엔 html2canvas 스크린샷 → 그다음엔 화면 텍스트만 옮겨적는
  // from-view 버전이었는데, 등급판정기준·경제성/환경효과 같은 실제 제출용 내용이 빠져있었다.)
  // serperApiKeyNh/deepseekApiKeyNh: 매입처 실시간 검색(Serper 검색 + DeepSeek 요약)을 본인
  // 개인 키로 한 번만 돌려보고 싶을 때만 선택 전달. 입력 안 하면 서버 키(없으면 정적 문구
  // 폴백)로 동작 - 기존과 동일. 이 함수는 절대 키를 콘솔에 찍거나 어디에도 저장하지
  // 않는다 - 요청 바디에 실어 보내고 끝.
  downloadProposalPdf: async ({ diagnosisData, proposalData, serperApiKeyNh, deepseekApiKeyNh }) => {
    const p = proposalData;
    if (!diagnosisData.capacityKwh) {
      throw new Error("이 차량은 배터리 공칭 용량 정보가 없어 PDF를 만들 수 없습니다.");
    }
    if (!diagnosisData.gradeLevel) {
      throw new Error("이 차량은 등급(1/2/3등급) 정보가 없어 PDF를 만들 수 없습니다.");
    }

    const indicators = { life: 0.5, capacity: 0.5, charge: 0.5, stability: 0.5 };
    for (const m of p.healthMetrics ?? []) {
      const key = batteryService._INDICATOR_KEY_BY_LABEL[m.label];
      if (!key) continue;
      const n = parseFloat(String(m.score));
      if (!Number.isNaN(n)) indicators[key] = n / 100;
    }

    const response = await api.post(
      "/api/battery-proposals/pdf",
      {
        capacityKwh: diagnosisData.capacityKwh,
        grade: diagnosisData.gradeLevel,
        rulCycles: diagnosisData.remainingCycle,
        fullLife: diagnosisData.newCycle,
        healthPct: diagnosisData.healthScore,
        indicators,
        ...(serperApiKeyNh ? { serperApiKeyNh } : {}),
        ...(deepseekApiKeyNh ? { deepseekApiKeyNh } : {}),
      },
      { responseType: "blob", timeout: 20000 },
    );
    return response.data; // Blob
  },

  // BatteryDiagnosis.jsx "배터리 잔존가치/판매처" 탭 전용.
  //
  // 예전엔 BATTERY_OFFERS DB 테이블(더미 데이터)을 그대로 읽었는데, 거기 buyer_name이
  // "테라사이클코리아" 같은 완전히 지어낸 이름이고 description도 "{회사명} 매입 제안"
  // 한 줄짜리 placeholder였다(data-generation/domain_nahyun/generate_data.py 확인 -
  // 실제 조사된 회사가 아니라 테스트용 더미). 이제는 검색 버튼을 안 눌러도 기본값부터
  // rul-diagnosis의 실제 조사된 매입처 목록(valuation.BUYERS - 현대글로비스·피엠그로우
  // 등, 사업 근거까지 정리된 실제 회사)과 그 계산식(BNEF/국내 낙찰가 등 출처 있는
  // 벤치마크)으로 산정한 값을 그대로 쓴다. 키 없이 fetchLiveOffers를 호출하면
  // discover_buyers()가 키 없어서 자동으로 이 고정 목록으로 폴백하므로 비용도 0원.
  getOffersByCarId: async (carId) => {
    const passport = await batteryService.getBatteryByCarId(carId);
    if (!passport) return null;
    const gradeLevel = passport.batteryLevel ? `${passport.batteryLevel}등급` : null;
    const capacityKwh = Number(passport.ratedCapacity) || null;
    if (!gradeLevel || !capacityKwh) return null;

    const { topBuyers, otherBuyers } = await batteryService.fetchLiveOffers({
      grade: gradeLevel,
      capacityKwh,
      condition: (Number(passport.sohScore) || 0) / 100,
    });
    if (topBuyers.length === 0) return null;
    const top = topBuyers[0];

    return {
      summary: {
        grade: passport.gradeDetail,
        gradeSub: `SOH ${passport.sohScore}% · ${passport.batteryType}`,
        remainingCycle: passport.remainingCycles,
        remainingCycleSub: passport.totalCycles
          ? `(신품 ${Number(passport.totalCycles).toLocaleString()})`
          : null,
        bestOffer: top.price,
        bestOfferSub: `${top.name} · ${top.priceSubtext}`,
      },
      topBuyers,
      otherBuyers,
    };
  },

  // "잔존가치/판매처" 탭 매입처 카드의 "실시간 검색" 버튼 전용. 이 매입처가 사용후 배터리를
  // 매입하겠다고 공개적으로 밝힌 근거자료를 찾아온다. 키는 이 요청 한 번만 쓰이고 어디에도
  // 저장·로그되지 않는다. 결과 disclosure가 null이면 호출부가 기존 DB 문구를 그대로 쓰면 됨.
  fetchBuyerDisclosure: async ({ buyerName, serperApiKeyNh, deepseekApiKeyNh }) => {
    const response = await api.post("/api/battery-offers/buyer-disclosure", {
      buyerName,
      ...(serperApiKeyNh ? { serperApiKeyNh } : {}),
      ...(deepseekApiKeyNh ? { deepseekApiKeyNh } : {}),
    });
    return response.data.disclosure; // string | null
  },

  // "잔존가치/판매처" 탭의 "실시간 검색으로 매입처 확인" 버튼 전용. DB 고정 목록이 아니라
  // 매입처 회사 자체를 실시간 검색으로 찾아서(가격은 기존 계산식 그대로) 목록을 다시 만든다.
  // live:false면 검색 실패/키 없음으로 rul-diagnosis가 자체적으로 고정 목록에 폴백한 것.
  fetchLiveOffers: async ({ grade, capacityKwh, condition, serperApiKeyNh, deepseekApiKeyNh }) => {
    const response = await api.post("/api/battery-offers/live-offers", {
      grade,
      capacityKwh,
      condition,
      ...(serperApiKeyNh ? { serperApiKeyNh } : {}),
      ...(deepseekApiKeyNh ? { deepseekApiKeyNh } : {}),
    });
    const { live, offers = [] } = response.data;
    const toManwon = (won) => Math.round(Number(won) / 10000);
    const mapped = offers.map((o, i) => ({
      rank: i + 1,
      name: o["매입처"],
      category: o["역할"],
      price: toManwon(o["제안가_원"]),
      priceSubtext: `${Math.round(Number(o["단가_원per_kWh"])).toLocaleString()} 원/kWh`,
      gradeLabel: o["단가대"],
      description: o["왜"],
      tag: o["확인된_사실"],
    }));
    return {
      live,
      topBuyers: mapped.slice(0, 3),
      otherBuyers: mapped.slice(3).map((b) => ({
        name: b.name,
        category: b.category,
        price: `${b.price} 만원`,
      })),
    };
  },
};
