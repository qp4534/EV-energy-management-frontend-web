import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNoticeDetail, updateNotice } from "../../services/noticeService";
import NoticeForm from "../../components/administrator/notice/NoticeForm";
import "../../styles/administrator/NoticeForm.css";

function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getNoticeDetail(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
  }, [id]);

  const handleSubmit = async (data) => {
    await updateNotice(id, data);
    alert("공지사항이 수정되었습니다!");
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