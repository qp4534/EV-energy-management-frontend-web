// src/mocks/logMock.js
// 로그 관리 페이지(로그인 기록 / 차량 등록·변경 / 이용자 활동 / 관리자 작업) Mock Data

export const MOCK_LOGIN_LOGS = [
  {
    logId: "login-001",
    user: "마동석",
    datetime: "2026-07-20 11:11",
    ip: "211.234.123.45",
    device: "Windows/Chrome",
    status: "성공",
    location: "서울 마포구",
  },
  {
    logId: "login-002",
    user: "강민경",
    datetime: "2026-07-20 11:12",
    ip: "118.235.12.34",
    device: "iOS/Safari",
    status: "성공",
    location: "서울 강남구",
  },
  {
    logId: "login-003",
    user: "손흥민",
    datetime: "2026-07-20 11:13",
    ip: "23.129.64.12",
    device: "macOS/Safari",
    status: "성공",
    location: "로스앤젤레스",
  },
  {
    logId: "login-004",
    user: "김문제",
    datetime: "2026-07-20 11:14",
    ip: "211.234.12.34",
    device: "iOS/Safari",
    status: "실패",
    location: "서울 용산구",
  },
];

export const MOCK_CAR_CHANGE_LOGS = [
  {
    logId: "car-change-001",
    carNumber: "112나 4885",
    owner: "마동석",
    changeType: "신규 등록",
    datetime: "2026-07-20 12:11",
    status: "승인",
  },
  {
    logId: "car-change-002",
    carNumber: "82다 8282",
    owner: "강민경",
    changeType: "차량 정보 수정",
    datetime: "2026-07-20 12:12",
    status: "대기",
  },
  {
    logId: "car-change-003",
    carNumber: "78손 1992",
    owner: "손흥민",
    changeType: "신규 등록",
    datetime: "2026-07-20 12:13",
    status: "승인",
  },
  {
    logId: "car-change-004",
    carNumber: "777문 7777",
    owner: "김문제",
    changeType: "차량 삭제",
    datetime: "2026-07-20 12:14",
    status: "반려",
  },
];

export const MOCK_USER_ACTIVITY_LOGS = [
  {
    logId: "activity-001",
    user: "마동석",
    action: "조회",
    target: "충전 이력 조회",
    datetime: "2026-07-20 13:11",
  },
  {
    logId: "activity-002",
    user: "강민경",
    action: "결제",
    target: "충전 요금 결제",
    datetime: "2026-07-20 13:12",
  },
  {
    logId: "activity-003",
    user: "손흥민",
    action: "조회",
    target: "결제 내역 조회",
    datetime: "2026-07-20 13:13",
  },
  {
    logId: "activity-004",
    user: "김민재",
    action: "다운로드",
    target: "보고서 다운로드",
    datetime: "2026-07-20 13:14",
  },
  {
    logId: "activity-005",
    user: "이강인",
    action: "수정",
    target: "비밀번호 변경",
    datetime: "2026-07-20 13:15",
  },
  {
    logId: "activity-006",
    user: "조규성",
    action: "클릭",
    target: "챗봇 문의 접수",
    datetime: "2026-07-20 13:16",
  },
  {
    logId: "activity-007",
    user: "조규성",
    action: "조회",
    target: "챗봇 답변 내용",
    datetime: "2026-07-20 13:17",
  },
];

export const MOCK_ADMIN_ACTION_LOGS = [
  {
    logId: "admin-action-001",
    admin: "김관리",
    action: "차량 등록 승인",
    target: "112나 4885 (마동석)",
    datetime: "2026-07-20 14:11",
  },
  {
    logId: "admin-action-002",
    admin: "이관리",
    action: "로그인 실패횟수 제한 5 변경",
    target: "보안 정책 관리",
    datetime: "2026-07-20 14:12",
  },
  {
    logId: "admin-action-003",
    admin: "박관리",
    action: "충전소C 게이트웨이 연동",
    target: "IoT 디바이스",
    datetime: "2026-07-20 14:13",
  },
  {
    logId: "admin-action-004",
    admin: "최관리",
    action: "차량 등록 삭제",
    target: "78손 1992 (손흥민)",
    datetime: "2026-07-20 14:14",
  },
  {
    logId: "admin-action-005",
    admin: "최관리",
    action: "차량 삭제 반려 처리",
    target: "777문 7777 (김문제)",
    datetime: "2026-07-20 14:15",
  },
  {
    logId: "admin-action-006",
    admin: "최관리",
    action: "회원 계정 정지",
    target: "김문제",
    datetime: "2026-07-20 14:16",
  },
  {
    logId: "admin-action-007",
    admin: "하관리",
    action: "Npay 연동",
    target: "결제 정책 변경",
    datetime: "2026-07-20 14:17",
  },
];
