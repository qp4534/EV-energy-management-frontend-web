import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/administrator/components/NoticeList.css";

export default function NoticeList({
  notices = [],
  limit = 5,
  importantOnly = true,
}) {
  const navigate = useNavigate();

  const displayedNotices = [...notices]
    .filter((notice) => {
      if (!importantOnly) return true;
      return notice.isImportant === true;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, limit);

  const goToDetail = (noticeId) => {
    navigate(`/admin/notices/${noticeId}`);
  };

  return (
    <div className="notice-table-wrap">
      <table className="notice-table">
        <tbody>
          {displayedNotices.map((notice) => (
            <tr
              key={notice.noticeId}
              onClick={() => goToDetail(notice.noticeId)}
              className="notice-row-clickable"
            >
              <td className="notice-level-cell">
                <span
                  className={`notice-badge ${
                    notice.isImportant ? "important" : "normal"
                  }`}
                >
                  {notice.isImportant ? "중요" : "일반"}
                </span>
              </td>

              <td className="notice-title-cell">{notice.title}</td>

              <td className="notice-author-cell">관리자</td>

              <td className="notice-date-cell">
                {notice.createdAt?.slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}