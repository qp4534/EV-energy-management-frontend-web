// 공지사항과 관련된 api를 관리할 예정
// NOTICE, NOTICE_ATTACHMENT와 관련된 api를 관리할 예정
import api from '../api/axios';

export const noticeService = {
  getNotices: async () => {
    const res = await api.get('/api/notices');
    return res.data;
  },

  getNoticeDetail: async (id) => {
    const res = await api.get(`/api/notices/${id}`);
    return res.data;
  },

  createNotice: async (noticeData) => {
    const res = await api.post('/api/notices', noticeData);
    return res.data;
  },

  updateNotice: async (id, noticeData) => {
    const res = await api.put(`/api/notices/${id}`, noticeData);
    return res.data;
  },

  deleteNotice: async (id) => {
    const res = await api.delete(`/api/notices/${id}`);
    return res.data;
  },

  // 공지사항 열람 처리 (NoticeDetail.jsx 진입 시 자동 호출)
  // 전체 필드를 덮어쓰는 PUT이라, isRead만 보내면 title/content 등이 지워진다.
  // (markReportAsRead 때와 같은 이유) 원본을 먼저 가져와 합친 뒤 보낸다.
  markNoticeAsRead: async (id) => {
    const { data: original } = await api.get(`/api/notices/${id}`);
    const res = await api.put(`/api/notices/${id}`, {
      ...original,
      isRead: true,
    });
    return res.data;
  },
};