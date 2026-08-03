// src/mocks/systemMock.js
// 시스템 관리 페이지(알림 채널/외부 연동/배치 작업/시스템 상태/백업 관리) 목데이터

export const MOCK_NOTIFICATION_CHANNELS = [
  { key: "sms", label: "알림 채널", desc: "관제팀 대표 번호로 발송", enabled: true },
  { key: "email", label: "이메일", desc: "관리자 전체 그룹 발송", enabled: true },
  { key: "push", label: "앱 푸시", desc: "모바일 앱 설치 이용자 대상", enabled: false },
];

export const MOCK_RISK_CHANNEL_MATRIX = {
  channels: [
    { key: "sms", label: "SMS" },
    { key: "email", label: "이메일" },
    { key: "push", label: "푸시" },
  ],
  rows: [
    { level: "매우 위험", sms: true, email: true, push: true },
    { level: "주의", sms: true, email: true, push: true },
    { level: "보통", sms: true, email: true, push: true },
    { level: "양호", sms: true, email: true, push: true },
  ],
};

export const MOCK_INTEGRATIONS = [
  {
    id: "iot-1",
    name: "IoT 디바이스 게이트웨이",
    desc: "배터리 센서 실시간 수집",
    maskedKey: "iot_live_••••••••7f2a",
  },
  {
    id: "iot-2",
    name: "IoT 디바이스 게이트웨이",
    desc: "배터리 센서 실시간 수집",
    maskedKey: "iot_live_••••••••7f2a",
  },
  {
    id: "iot-3",
    name: "IoT 디바이스 게이트웨이",
    desc: "배터리 센서 실시간 수집",
    maskedKey: "iot_live_••••••••7f2a",
  },
];

export const MOCK_BATCH_JOBS = [
  {
    id: "job-soh",
    name: "야간 SOH 집계",
    cycle: "매일 07:00",
    lastRun: "07/19 07:00",
    lastRunResult: "성공",
    nextRun: "07/20 07:00",
    status: "success",
  },
  {
    id: "job-fire-scan",
    name: "화재 위험 알림 스캔",
    cycle: "5분 마다",
    lastRun: "10분 전",
    lastRunResult: "성공",
    nextRun: "5분 후",
    status: "success",
  },
  {
    id: "job-weekly-report",
    name: "주간 리포트 생성",
    cycle: "매주 월 08:00",
    lastRun: "07/14 08:00",
    lastRunResult: "성공",
    nextRun: "07/21 08:00",
    status: "success",
  },
  {
    id: "job-recycle-grade",
    name: "재활용 등급 재산정",
    cycle: "매일 2:00",
    lastRun: "07/20 02:00",
    lastRunResult: "실패",
    nextRun: "07/20 02:00",
    status: "error",
  },
];

export const MOCK_RESOURCE_USAGE = [
  { key: "cpu", label: "CPU", percent: 42 },
  { key: "memory", label: "메모리", percent: 68 },
  { key: "disk", label: "디스크", percent: 55 },
];

export const MOCK_DEPLOY_HISTORY = [
  { version: "v 1.4.2", date: "2026-07-15 21:10", desc: "재활용 등급 판정 로직 개선" },
  { version: "v 1.4.1", date: "2026-07-12 10:03", desc: "화재 알림 임계치 조정" },
  { version: "v 1.4.0", date: "2026-07-05 16:44", desc: "이용자 관리 페이지 배포" },
];

export const MOCK_BACKUPS = [
  { id: "BK-0716", type: "전체 백업", size: "4.2GB", completedAt: "2026-07-16 03:00", status: "success" },
  { id: "BK-0715", type: "증분 백업", size: "4.2GB", completedAt: "2026-07-16 03:00", status: "success" },
  { id: "BK-0714", type: "증분 백업", size: "4.2GB", completedAt: "2026-07-16 03:00", status: "success" },
  { id: "BK-0713", type: "증분 백업", size: "4.2GB", completedAt: "2026-07-16 03:00", status: "error" },
];
