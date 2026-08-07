import { useNavigate, useParams } from "react-router-dom";
import { useNoticeDetail, useUpdateNotice } from "../../hooks/queries/useNotice";
import NoticeForm from "../../components/administrator/notice/NoticeForm";
import "../../styles/administrator/NoticeForm.css";

function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: initialData, isLoading } = useNoticeDetail(id);
  const updateNoticeMutation = useUpdateNotice();

  const handleSubmit = async (formData) => {
    // NoticeForm은 "target"으로 넘기지만 백엔드 NoticeDto는 "targetRole"이라 이름을 맞춰줌.
    // userId는 화면에서 안 바꾸는 값이라, 원본 조회 데이터(initialData.userId)를 그대로 유지 —
    // 안 넣으면 NOT NULL 위반으로 500 남 (NoticeWrite.jsx와 같은 이유).
    const { target, ...rest } = formData;

    try {
      await updateNoticeMutation.mutateAsync({
        id,
        noticeData: {
          ...rest,
          targetRole: target,
          userId: initialData?.userId,
        },
      });
      alert("공지사항이 수정되었습니다!");
      navigate(`/admin/notices/${id}`);
    } catch (err) {
      console.error("공지사항 수정 실패:", err);
      alert("공지사항 수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  if (isLoading || !initialData) return <div className="notice-detail-loading">불러오는 중...</div>;

  return (
    <div className="notice-form">
      <h2>공지사항 수정</h2>
      <NoticeForm
        initialData={{ ...initialData, target: initialData.targetRole }}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/admin/notices/${id}`)}
        submitLabel={updateNoticeMutation.isPending ? "수정 중..." : "수정"}
      />
    </div>
  );
}

export default NoticeEdit;