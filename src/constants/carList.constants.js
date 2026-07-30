// 위험도: ERD ANOMALY_LOGS.risk_level 값을 그대로 사용 (긴급, 경고, 주의, 정상)
// mock/서버가 이미 한글 문자열로 내려주므로 별도 영문 enum 매핑 없이 값 자체를 키로 사용한다.
export const RISK_LEVELS = ["긴급", "경고", "주의", "정상"];

// 위험도별 배지/스와치 색상.
// StatCardItem.jsx에 있던 실제 색상을 index.css --color-risk-* 변수로 옮긴 것을 그대로 재사용한다.
// (StatCardItem은 type: emergency/warning/caution/normal 영문 키, 여기는 한글 리스크값 키라서
//  이름 공간은 다르지만 같은 CSS 변수를 가리키도록 맞춰뒀다.)
export const RISK_LEVEL_COLOR = {
  긴급: "bg-[var(--color-risk-emergency)]",
  경고: "bg-[var(--color-risk-warning)]",
  주의: "bg-[var(--color-risk-caution)]",
  정상: "bg-[var(--color-risk-normal)]",
};

// 충전 상태: ERD CHARGING_SESSION.change_state 값을 그대로 사용
export const CHARGING_STATUSES = ["충전 중", "중단됨", "충전 완료", "대기 중"];

// 이상 유형: ERD ANOMALY_LOGS.abnormal_type 코멘트('화재 위험, 온도 상승, 정상 등') + mock 실사용값 기준
export const ANOMALY_TYPES = ["화재 위험", "온도 상승", "과충전 경고", "정상"];

// 지역: CHARGING_STATION.region 코멘트 기준 17개 광역지자체
export const REGIONS = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

export const PAGE_SIZE = 10;

// CarFilterPanel 초기값 / 리셋값 (carService.getCarTableList 파라미터명과 동일하게 맞춤)
export const DEFAULT_CAR_FILTERS = {
  riskLevel: "all",
  region: "all",
  abnormalType: "all",
  chargingTimeFrom: "00:00",
  chargingStatus: "all",
};
