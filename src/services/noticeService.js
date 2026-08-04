// 공지사항과 관련된 api를 관리할 예정
// NOTICE, NOTICE_ATTACHMENT와 관련된 api를 관리할 예정
import api from '../api/axios';

export const getNotices = async () => {
  const res = await api.get('/api/notices');
  return res.data;
};

export const getNoticeDetail = async (id) => {
  const res = await api.get(`/api/notices/${id}`);
  return res.data;
};

export const createNotice = async (noticeData) => {
  const res = await api.post('/api/notices', noticeData);
  return res.data;
};

export const updateNotice = async (id, noticeData) => {
  const res = await api.put(`/api/notices/${id}`, noticeData);
  return res.data;
};

export const deleteNotice = async (id) => {
  const res = await api.delete(`/api/notices/${id}`);
  return res.data;
};