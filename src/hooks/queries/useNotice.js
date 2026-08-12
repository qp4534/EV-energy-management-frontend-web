// noticeService 결과를 컴포넌트에 전달
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { noticeService } from "@/services/noticeService";

// 공지사항 목록 조회 (NoticeManage.jsx)
export const useNotices = () => {
  return useQuery({
    queryKey: ["notices"],
    queryFn: noticeService.getNotices,
  });
};

// 공지사항 상세 조회 (NoticeDetail.jsx, NoticeEdit.jsx)
export const useNoticeDetail = (id) => {
  return useQuery({
    queryKey: ["notices", id],
    queryFn: () => noticeService.getNoticeDetail(id),
    enabled: !!id,
  });
};

// 공지사항 작성 (NoticeWrite.jsx)
export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noticeData) => noticeService.createNotice(noticeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};

// 공지사항 수정 (NoticeEdit.jsx)
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, noticeData }) => noticeService.updateNotice(id, noticeData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notices", variables.id] });
    },
  });
};

// 공지사항 삭제 (NoticeDetail.jsx)
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => noticeService.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};

// 공지사항 열람 처리 (NoticeDetail.jsx 마운트 시 자동 호출)
export const useMarkNoticeAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => noticeService.markNoticeAsRead(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notices", id] });
    },
  });
};

// 공지 상세 첨부파일 목록 (NoticeDetail.jsx)
export const useNoticeAttachments = (noticeId) => {
  return useQuery({
    queryKey: ["noticeAttachments", noticeId],
    queryFn: () => noticeService.getAttachmentsByNoticeId(noticeId),
    enabled: !!noticeId,
  });
};