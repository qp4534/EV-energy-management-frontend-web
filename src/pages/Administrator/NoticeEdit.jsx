import { useNavigate, useParams } from "react-router-dom";
import { useNoticeDetail, useUpdateNotice, useNoticeAttachments } from "../../hooks/queries/useNotice";
import NoticeForm from "../../components/administrator/notice/NoticeForm";
import { noticeAttachmentService } from "../../services/noticeAttachmentService";
import "../../styles/administrator/NoticeForm.css";

function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: initialData, isLoading } = useNoticeDetail(id);
  const { data: existingAttachments } = useNoticeAttachments(id);
  const updateNoticeMutation = useUpdateNotice();

  const handleSubmit = async (formData) => {
    // NoticeForm은 "target"으로 넘기지만 백엔드 NoticeDto는 "targetRole"이라 이름을 맞춰줌.
    // ERD상 target_role은 'ADMIN'/'CONTROLLER'만 허용하고, "전체"는 null(제한 없음)로 표현.
    //
    // viewCount/isRead가 ERD상 NOT NULL인데 NoticeForm은 이 값들을 안 다루기 때문에,
    // formData만 보내면 PUT이 전체를 덮어쓰면서 이 필드들이 null이 되어 제약 위반(500)이 남.
    // 그래서 initialData(원본 전체)를 베이스로 깔고, 폼에서 실제로 바뀌는 값만 덮어씀.
    const { target, file, ...rest } = formData;
    const TARGET_ROLE_MAP = { 전체: null, 관리자: "ADMIN", 관제자: "CONTROLLER", 이용자: "USER" };

    try {
      await updateNoticeMutation.mutateAsync({
        id,
        noticeData: {
          ...initialData,
          ...rest,
          targetRole: TARGET_ROLE_MAP[target] ?? null,
        },
      });

      // 새 파일을 골랐으면, 기존 첨부파일은 지우고(S3+DB) 새 파일로 교체
      if (file) {
        try {
          await Promise.all(
            (existingAttachments ?? []).map((a) =>
              noticeAttachmentService.deleteAttachment(a.attachmentId)
            )
          );
          await noticeAttachmentService.uploadFile(file, id);
        } catch (uploadErr) {
          console.error("첨부파일 교체 실패:", uploadErr);
          alert("공지사항은 수정됐지만, 첨부파일 교체에는 실패했습니다.");
          navigate(`/admin/notices/${id}`);
          return;
        }
      }

      alert("공지사항이 수정되었습니다!");
      navigate(`/admin/notices/${id}`);
    } catch (err) {
      console.error("공지사항 수정 실패:", err);
      alert("공지사항 수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  if (isLoading || !initialData) return <div className="notice-detail-loading">불러오는 중...</div>;

  // 백엔드 targetRole('ADMIN'/'CONTROLLER'/null) -> 화면 드롭다운 값(한글)으로 역변환
  const ROLE_TO_TARGET_MAP = { ADMIN: "관리자", CONTROLLER: "관제자", USER: "이용자" };
  const initialFormData = {
    ...initialData,
    target: ROLE_TO_TARGET_MAP[initialData.targetRole] ?? "전체",
  };

  return (
    <div className="notice-form">
      <h2>공지사항 수정</h2>
      <NoticeForm
        initialData={initialFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/admin/notices/${id}`)}
        submitLabel={updateNoticeMutation.isPending ? "수정 중..." : "수정"}
      />
    </div>
  );
}

export default NoticeEdit;