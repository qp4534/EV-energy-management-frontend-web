export const REPORT_TYPES = ["월간보고서", "이상"];

export const REPORT_TYPE_LABEL = {
  월간보고서: "정기 보고서",
  이상: "이상 보고서",
};

export const PAGE_SIZE = 10;

export const DEFAULT_REPORT_FILTERS = {
  reportType: "all",
  dateFrom: "",
  dateTo: "",
};

export const DEFAULT_CAR_REPORT_FILTERS = {
  reportType: "all",
};

export const REPORT_RISK_BADGE_LABEL = {
  긴급: "위험도 높음",
  경고: "위험도 중간",
  주의: "위험도 낮음",
  정상: "정상",
};

export const REPORT_SECTION_TYPES = {
  SUMMARY: "summary", // 문단형 요약 텍스트
  METRIC_GRID: "metricGrid", // 지표 카드 그리드 (label/value/unit/caption/emphasis)
  LINE_CHART: "lineChart", // 시계열 라인 차트 (label/value 포인트 배열)
  NUMBERED_LIST: "numberedList", // 번호 매긴 목록 (원인 분석 등)
  BULLET_LIST: "bulletList", // 불릿 목록 (권장 조치 등)
};
