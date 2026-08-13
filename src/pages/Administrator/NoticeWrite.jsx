import { useNavigate } from "react-router-dom";
import NoticeForm from "../../components/administrator/notice/NoticeForm";
import { useCreateNotice } from "../../hooks/queries/useNotice";
import { useProfile } from "../../hooks/queries/useUser";
import { noticeAttachmentService } from "../../services/noticeAttachmentService";
import "../../styles/administrator/NoticeForm.css";

function NoticeWrite() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const createNoticeMutation = useCreateNotice();

  const handleSubmit = async (formData) => {
    // NoticeForm은 "target"으로 넘기지만 백엔드 NoticeDto는 "targetRole"이라 이름을 맞춰줌.
    // ERD상 target_role은 'ADMIN'/'CONTROLLER'/'USER'만 허용하고, "전체"는 null(제한 없음)로
    // 표현한다 (NoticeEdit.jsx와 동일한 매핑 - 여기 없어서 한글 값이 그대로 저장되던 버그였음).
    const TARGET_ROLE_MAP = { 전체: null, 관리자: "ADMIN", 관제자: "CONTROLLER", 이용자: "USER" };
    const { target, file, ...rest } = formData;

    try {
      const saved = await createNoticeMutation.mutateAsync({
        ...rest,
        targetRole: TARGET_ROLE_MAP[target] ?? null,
        userId: profile?.userId,
      });

      // 공지 저장 성공 후, 파일이 선택돼 있으면 그제서야 S3 업로드 진행
      // (noticeId가 있어야 첨부파일 기록을 어느 공지에 붙일지 알 수 있어서 순서가 이렇게 됨)
      if (file) {
        try {
          await noticeAttachmentService.uploadFile(file, saved.noticeId);
        } catch (uploadErr) {
          console.error("첨부파일 업로드 실패:", uploadErr);
          alert("공지사항은 등록됐지만, 첨부파일 업로드에는 실패했습니다. 수정 화면에서 다시 첨부해주세요.");
          navigate("/admin/notices");
          return;
        }
      }

      alert("공지사항이 등록되었습니다.");
      navigate("/admin/notices");
    } catch (err) {
      console.error("공지사항 등록 실패:", err);
      alert("공지사항 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="notice-form">
      <h2>공지사항 작성</h2>
      <NoticeForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/notices")}
        submitLabel={createNoticeMutation.isPending ? "등록 중..." : "등록"}
      />
    </div>
  );
}

export default NoticeWrite;