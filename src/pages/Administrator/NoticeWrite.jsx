import { useNavigate } from "react-router-dom";
import NoticeForm from "../../components/administrator/notice/NoticeForm";
import { useCreateNotice } from "../../hooks/queries/useNotice";
import { useProfile } from "../../hooks/queries/useUser";
import "../../styles/administrator/NoticeForm.css";

function NoticeWrite() {
  const navigate = useNavigate();
  // 로그인한 사용자 정보 (/api/auth/me). 백엔드 NoticeDto.userId가 NOT NULL이라 필수로 같이 보내야 함.
  // TODO: profile 응답 필드명이 실제로 userId가 맞는지 확인 필요 (id일 수도 있음 - 500 계속 나면 이 부분부터 의심)
  const { data: profile } = useProfile();
  const createNoticeMutation = useCreateNotice();

  const handleSubmit = async (formData) => {
    // NoticeForm은 "target"으로 넘기지만 백엔드 NoticeDto는 "targetRole"이라 이름을 맞춰줌
    const { target, ...rest } = formData;

    try {
      await createNoticeMutation.mutateAsync({
        ...rest,
        targetRole: target,
        userId: profile?.userId,
      });
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