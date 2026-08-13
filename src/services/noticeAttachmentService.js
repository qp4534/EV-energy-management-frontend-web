// 공지 첨부파일 S3 업로드와 관련된 api를 관리
// 업로드는 2단계: ① 임시 업로드 링크 발급 → ② 그 링크로 S3에 직접 PUT → ③ 성공하면 기록 저장
import api from "../api/axios";

export const noticeAttachmentService = {
  getUploadUrl: async (fileName, contentType) => {
    const { data } = await api.get("/api/notice-attachments/upload-url", {
      params: { fileName, contentType },
    });
    return data; // { uploadUrl, objectKey }
  },

  // S3는 우리 서버가 아니라서 axios(api) 인스턴스 안 쓰고 fetch로 직접 PUT
  uploadToS3: async (uploadUrl, file) => {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) {
      throw new Error("파일 업로드에 실패했습니다.");
    }
  },

  createAttachment: async ({ fileName, objectKey, fileSize, fileType, noticeId }) => {
    const { data } = await api.post("/api/notice-attachments", {
      fileName,
      fileUrl: objectKey,
      fileSize,
      fileType,
      noticeId,
    });
    return data;
  },

  deleteAttachment: async (attachmentId) => {
    await api.delete(`/api/notice-attachments/${attachmentId}`);
  },

  // 위 3단계를 한 번에 실행하는 헬퍼
  uploadFile: async (file, noticeId) => {
    const { uploadUrl, objectKey } = await noticeAttachmentService.getUploadUrl(
      file.name,
      file.type
    );
    await noticeAttachmentService.uploadToS3(uploadUrl, file);
    return noticeAttachmentService.createAttachment({
      fileName: file.name,
      objectKey,
      fileSize: file.size,
      fileType: file.type,
      noticeId,
    });
  },
};