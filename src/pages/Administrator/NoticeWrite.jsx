import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoticeForm from "../../components/administrator/notice/NoticeForm";
import { createNotice } from "../../services/noticeService";
import "../../styles/administrator/NoticeForm.css";

function NoticeWrite() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await createNotice(data);
      alert("공지사항이 등록되었습니다.");
      navigate("/admin/notices");
    } catch (err) {
      console.error("공지사항 등록 실패:", err);
      alert("공지사항 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="notice-form">
      <h2>공지사항 작성</h2>
      <NoticeForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/notices")}
        submitLabel={isSubmitting ? "등록 중..." : "등록"}
      />
    </div>
  );
}

export default NoticeWrite;