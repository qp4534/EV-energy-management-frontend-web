// 보고서 유형: ERD AI_REPORTS.report_type 기준.
// 주의: ERD 코멘트는 "월간, 이상"이라고 되어있는데 실제 DEFAULT 값은 '월간보고서'로 되어있어
// 코멘트와 DEFAULT 리터럴이 서로 다름. 여기서는 DEFAULT 리터럴("월간보고서")을 실값으로 채택했다.
// 실제 백엔드 값이 다르면(예: "월간") 이 배열만 고치면 됨.
export const REPORT_TYPES = ["월간보고서", "이상"];

// 화면에 보여줄 라벨은 report_type 원래 값과 다르게 표기됨 (정기 보고서 / 이상 보고서)
export const REPORT_TYPE_LABEL = {
  월간보고서: "정기 보고서",
  이상: "이상 보고서",
};

export const PAGE_SIZE = 10;

// ReportFilterPanel 초기값 / 리셋값. 날짜는 기본적으로 제한 없음(빈 문자열 = 전체 기간).
export const DEFAULT_REPORT_FILTERS = {
  reportType: "all",
  dateFrom: "",
  dateTo: "",
};

// 상세 페이지 상단 위험도 뱃지 라벨. 기존 ANOMALY_LOGS.risk_level(긴급/경고/주의/정상) 값을 그대로 쓰되
// 보고서 화면에서는 다른 문구로 보여준다. "긴급 -> 위험도 높음"만 실제 화면(스크린샷)에서 확인했고,
// 나머지 세 값은 같은 톤으로 추정해서 채운 것 - 실제 문구 확정되면 여기만 고치면 됨.
export const REPORT_RISK_BADGE_LABEL = {
  긴급: "위험도 높음",
  경고: "위험도 중간",
  주의: "위험도 낮음",
  정상: "정상",
};

// report_data(JSONB) 안 sections 배열의 각 항목이 가질 수 있는 type 값.
// 프론트는 이 type만 보고 어떤 섹션 컴포넌트로 렌더링할지 결정한다.
// (이상보고서/정기보고서가 이 다섯 가지 블록을 조합해서 서로 다른 내용을 채우는 구조)
export const REPORT_SECTION_TYPES = {
  SUMMARY: "summary", // 문단형 요약 텍스트
  METRIC_GRID: "metricGrid", // 지표 카드 그리드 (label/value/unit/caption/emphasis)
  LINE_CHART: "lineChart", // 시계열 라인 차트 (label/value 포인트 배열)
  NUMBERED_LIST: "numberedList", // 번호 매긴 목록 (원인 분석 등)
  BULLET_LIST: "bulletList", // 불릿 목록 (권장 조치 등)
};
