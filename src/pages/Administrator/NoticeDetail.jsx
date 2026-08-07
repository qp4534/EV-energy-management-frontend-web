import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNoticeDetail, useDeleteNotice, useMarkNoticeAsRead } from "../../hooks/queries/useNotice";
import "../../styles/administrator/NoticeDetail.css";

function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: notice, isLoading } = useNoticeDetail(id);
  const deleteNoticeMutation = useDeleteNotice();
  const markAsReadMutation = useMarkNoticeAsRead();
  const [isDeleting, setIsDeleting] = useState(false);

  // 상세 진입 시 아직 안 읽은 공지면 자동으로 열람 처리.
  // notice.isRead가 이미 true면 다시 안 부름 (불필요한 PUT 방지 + 무한 호출 방지).
  useEffect(() => {
    if (notice && !notice.isRead) {
      markAsReadMutation.mutate(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice?.noticeId, notice?.isRead]);

  // TODO: 이전글/다음글 이동 기능. 백엔드에 목록 순서 기준 prev/next를
  // 내려주는 API가 없어서 아직 비활성 상태로 둠.
  const prevNext = { prev: null, next: null };

  const handleDelete = async () => {
    if (!window.confirm("이 공지사항을 삭제하시겠습니까?")) return;
    try {
      setIsDeleting(true);
      await deleteNoticeMutation.mutateAsync(id);
      navigate("/admin/notices");
    } catch (err) {
      console.error("공지사항 삭제 실패:", err);
      alert("삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !notice) return <div className="notice-detail-loading">불러오는 중...</div>;

  // "2026-08-01T03:58:56Z" -> "2026-08-01 12:58"
  const formattedDate = (() => {
    if (!notice.createdAt) return "-";
    const d = new Date(notice.createdAt);
    if (Number.isNaN(d.getTime())) return "-";
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    return `${date} ${time}`;
  })();

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
            <button className="btn-delete" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticeDetail;