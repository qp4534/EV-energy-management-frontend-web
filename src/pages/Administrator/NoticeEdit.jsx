import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_NOTICES } from "../../mocks/noticeMock";
import NoticeForm from "../../components/administrator/NoticeForm";
import "../../styles/administrator/NoticeForm.css";

const updateNoticeMock = async (noticeId, data) => {
  console.log("수정 데이터:", noticeId, data);
  return new Promise((resolve) => setTimeout(resolve, 300));
};

function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const found = MOCK_NOTICES.find((n) => n.noticeId === id);
    setInitialData(found || null);
  }, [id]);

  const handleSubmit = async (data) => {
    await updateNoticeMock(id, data);
    alert("공지사항이 수정되었습니다! (임시)");
    navigate(`/admin/notices/${id}`);
  };

  if (!initialData) return <div className="notice-detail-loading">불러오는 중...</div>;

  return (
    <div className="notice-form">
      <h2>공지사항 수정</h2>
      <NoticeForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/admin/notices/${id}`)}
        submitLabel="수정"
      />
    </div>
  );
}

export default NoticeEdit;