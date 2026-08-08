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

    // battery_level 컬럼은 '1'/'2'/'3'뿐 아니라 DEFAULT '미등록'도 들어있을 수 있다
    // (schema.sql 코멘트 참고). '미등록'이면 gradeLevel을 못 쓰므로, 화면에 이미 나오는
    // gradeDetail(재사용/2차사용/재활용급)로부터 등급을 유추하는 걸로 대신한다.
    const validLevel = ["1", "2", "3"].includes(String(d.batteryLevel)) ? d.batteryLevel : null;
    const levelFromGradeDetail = d.gradeDetail?.includes("재사용")
      ? "1"
      : d.gradeDetail?.includes("2차사용")
        ? "2"
        : d.gradeDetail?.includes("재활용") || d.gradeDetail?.includes("수거")
          ? "3"
          : null;
    const gradeLevel = validLevel || levelFromGradeDetail;

    return {
      grade: d.gradeDetail,
      // PDF(/report/pdf/full)는 "1등급"/"2등급"/"3등급" 형식을 요구한다 - 화면 표시용
      // grade(gradeDetail, 예: "재사용(EV 재제조)급")와는 다른 값이라 따로 둔다.
      gradeLevel: gradeLevel ? `${gradeLevel}등급` : null,
      // rated_capacity는 DB에 "77.4kWh"처럼 단위가 붙은 문자열로 저장돼 있어서
      // Number()로는 항상 NaN이 나왔다(Number는 문자열 전체가 숫자여야 함) - parseFloat는
      // 앞쪽 숫자만 읽으므로 정상 파싱된다.
      capacityKwh: parseFloat(d.ratedCapacity) || null,
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
  // 매입처 실시간 검색(Serper+DeepSeek)은 서버 쪽 시크릿(rul-diagnosis-secret)으로
  // 자동 처리된다 - 개인 키를 화면에서 입력받지 않는다.
  // chosenBuyer: BuyerCard/ProposalContent에서 사용자가 top3 중 고른 매입처의 원본(raw,
  // 한글 키) 오퍼 객체 - fetchLiveOffers()가 각 buyer에 붙여둔 `raw` 필드 그대로 넘기면
  // 된다. 안 넘기면(아직 매입처를 못 찾았을 때) 백엔드가 기존처럼 1순위 매입처로 계산한다.
  // reasons: 화면 "귀사에 적합한 이유"에 이미 표시된 문구 - PDF에도 그대로 반영해서
  // 화면·PDF 내용이 어긋나지 않게 한다.
  downloadProposalPdf: async ({ diagnosisData, proposalData, chosenBuyer }) => {
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
        chosenBuyer: chosenBuyer?.raw ?? null,
        reasons: p.reasons ?? [],
      },
      { responseType: "blob", timeout: 20000 },
    );
    return response.data; // Blob
  },

  // BatteryDiagnosis.jsx "잔존가치/판매처" 탭의 "매입처 3곳 찾기" 버튼 전용.
  //
  // 예전엔 BATTERY_OFFERS DB 테이블(더미 데이터)을 그대로 읽었는데, 거기 buyer_name이
  // "테라사이클코리아" 같은 완전히 지어낸 이름이고 description도 "{회사명} 매입 제안"
  // 한 줄짜리 placeholder였다(data-generation/domain_nahyun/generate_data.py 확인 -
  // 실제 조사된 회사가 아니라 테스트용 더미). 이제는 매입처 회사 자체를 rul-diagnosis가
  // 실시간 검색으로 찾아서(가격은 valuation.BUYERS 계산식 - BNEF/국내 낙찰가 등 출처
  // 있는 벤치마크 - 그대로) 목록을 만든다. 서버 시크릿으로 자동 동작하고, 검색이 안
  // 되면 자체적으로 고정 매입처 목록에 폴백한다(live:false).
  fetchLiveOffers: async ({ grade, capacityKwh, condition }) => {
    // 이 호출 체인(백엔드 -> rul-diagnosis -> Serper 검색(최대 8s) + DeepSeek 요약(최대 20s))은
    // 실제로 20초 가까이 걸릴 수 있다(백엔드 RestClient의 read-timeout도 20000ms로 맞춰져
    // 있음). axios 기본 인스턴스 timeout(5000ms)을 그대로 쓰면 백엔드가 응답하기도 전에
    // 프론트가 먼저 타임아웃 나버려서 "매입처 조회에 실패했어요"가 항상 뜨는 문제가 있었다.
    const response = await api.post(
      "/api/battery-offers/live-offers",
      { grade, capacityKwh, condition },
      { timeout: 30000 },
    );
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
      // 근거 하이퍼링크 - 매입처는 valuation.BUYERS(정적)/실시간 검색 결과의 출처 링크,
      // 단가는 항상 같은 가격 산정 출처(BNEF 등)를 가리킨다.
      sourceUrl: o["출처_링크"] || "",
      priceSourceUrl: o["단가출처_링크"] || "",
      priceSourceLabel: o["단가출처_라벨"] || "",
      // raw: PDF 생성 시(downloadProposalPdf) 그대로 되돌려 보낼 원본(한글 키) 오퍼 객체 -
      // 화면에서 고른 매입처와 PDF에 적힌 매입처가 어긋나지 않게 하기 위함.
      raw: o,
    }));
    return {
      live,
      topBuyers: mapped.slice(0, 3),
      otherBuyers: mapped.slice(3).map((b) => ({
        name: b.name,
        category: b.category,
        price: `${b.price} 만원`,
      })),
      priceSourceUrl: mapped[0]?.priceSourceUrl || "",
      priceSourceLabel: mapped[0]?.priceSourceLabel || "",
    };
  },
};
