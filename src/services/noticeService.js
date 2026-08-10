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
  markNoticeAsRead: async (id) => {
    const { data: original } = await api.get(`/api/notices/${id}`);
    const res = await api.put(`/api/notices/${id}`, {
      ...original,
      isRead: true,
    });
    return res.data;
  },

  // 공지 상세 페이지 첨부파일 목록
  getAttachmentsByNoticeId: async (noticeId) => {
    const res = await api.get('/api/notice-attachments');
    return res.data.filter((a) => a.noticeId === noticeId);
  },
};