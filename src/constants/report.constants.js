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
