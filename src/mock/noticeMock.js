// 공지사항 및 첨부파일 Mock Data
export const MOCK_NOTICES = [
  {
    noticeId: "notice-001",
    title: "[안내] 시스템 정기 점검 및 관제 점검 안내",
    content:
      "안정적인 서비스 제공을 위해 7월 30일 새벽 2시부터 4시까지 정기 점검이 진행됩니다.",
    isPinned: true,
    createdAt: "2026-07-25T10:00:00Z",
    userId: "admin-uuid-001",
    attachments: [
      {
        attachmentId: "att-001",
        fileName: "점검_일정 안내.pdf",
        fileUrl: "https://example.com/files/notice-01.pdf",
        fileSize: 1048576,
        fileType: "application/pdf",
      },
    ],
  },
  {
    noticeId: "notice-002",
    title: "배터리 진단 알고리즘 버전 v2.1 업데이트",
    content: "SOH 예측 모델 정확도가 개선된 v2.1 업데이트가 적용되었습니다.",
    isPinned: false,
    createdAt: "2026-07-20T14:30:00Z",
    userId: "admin-uuid-001",
    attachments: [],
  },
];

// 알림 채널 및 설정 매트릭스 Mock Data
export const MOCK_NOTIFICATION_CHANNELS = [
  { channelId: "ch-email", channelName: "이메일 알림", isActive: true },
  { channelId: "ch-sms", channelName: "문자(SMS) 알림", isActive: true },
  { channelId: "ch-push", channelName: "앱 푸시 알림", isActive: false },
];

export const MOCK_NOTIFICATION_MATRIX = [
  {
    matrixId: "mx-001",
    riskLevel: "긴급",
    isEnabled: true,
    channelId: "ch-sms",
  },
  {
    matrixId: "mx-002",
    riskLevel: "경고",
    isEnabled: true,
    channelId: "ch-email",
  },
  {
    matrixId: "mx-003",
    riskLevel: "주의",
    isEnabled: false,
    channelId: "ch-push",
  },
];
