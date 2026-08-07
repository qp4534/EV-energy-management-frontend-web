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
};
