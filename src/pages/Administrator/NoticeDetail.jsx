import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNoticeDetail } from '../../services/noticeService';
import "../../styles/administrator/NoticeDetail.css";

function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [prevNext, setPrevNext] = useState({ prev: null, next: null });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getNoticeDetail(id);
        setNotice(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm("이 공지사항을 삭제하시겠습니까?")) return;
    navigate("/admin/notices");
  };

  if (!notice) return <div className="notice-detail-loading">불러오는 중...</div>;

  const formattedDate = notice.createdAt
    ? new Date(notice.createdAt).toISOString().slice(0, 10)
    : "-";

  return (
    <div className="notice-detail">
      <h2>공지사항 상세</h2>

      <div className="notice-detail-box">
        <div className="detail-badges">
          <span className={notice.isImportant ? "badge-important" : "badge-normal"}>
            {notice.isImportant ? "중요" : "일반"}
          </span>
        </div>

        <h3 className="detail-title">{notice.title}</h3>

        <div className="detail-meta">
          <span>작성일: {formattedDate}</span>
        </div>

        {notice.attachments?.length > 0 && (
          <div className="detail-attachments">
            {notice.attachments.map((file) => (
              <div className="detail-attachment" key={file.attachmentId}>
                <i className="ti ti-paperclip" aria-hidden="true"></i>
                <span className="file-name">
                  {file.fileName} ({(file.fileSize / 1024 / 1024).toFixed(1)}MB)
                </span>
                <button className="download-btn">다운로드</button>
              </div>
            ))}
          </div>
        )}

        <div className="detail-content">{notice.content}</div>

        <div className="detail-navigation">
          <div className="nav-row">
            <span className="nav-label-prevwrite">이전글</span>
            <span
              className={prevNext.prev ? "nav-link" : "nav-disabled"}
              onClick={() =>
                prevNext.prev &&
                navigate(`/admin/notices/${prevNext.prev.noticeId}`)
              }
            >
              {prevNext.prev ? prevNext.prev.title : "이전 글이 없습니다"}
            </span>
          </div>
          <div className="nav-row">
            <span className="nav-label-nextwrite">다음글</span>
            <span
              className={prevNext.next ? "nav-link" : "nav-disabled"}
              onClick={() =>
                prevNext.next &&
                navigate(`/admin/notices/${prevNext.next.noticeId}`)
              }
            >
              {prevNext.next ? prevNext.next.title : "다음 글이 없습니다"}
            </span>
          </div>
        </div>

        <div className="detail-actions">
          <button
            className="btn-list"
            onClick={() => navigate("/admin/notices")}
          >
            목록으로
          </button>
          <div className="action-right">
            <button
              className="btn-edit"
              onClick={() => navigate(`/admin/notices/${id}/edit`)}
            >
              수정
            </button>
            <button className="btn-delete" onClick={handleDelete}>
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticeDetail;