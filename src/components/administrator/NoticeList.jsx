import React from "react";
import "../../styles/administrator/components/NoticeList.css";

export default function NoticeList({
  notices = [],
  limit = 5,
  importantOnly = true,
}) {
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

  return (
    <div className="notice-table-wrap">
      <table className="notice-table">
        <tbody>
          {displayedNotices.map((notice) => (
            <tr key={notice.noticeId}>
              <td className="notice-level-cell">
                <span className="notice-level">[중요]</span>
              </td>

              <td className="notice-title-cell">
                {notice.title}
              </td>

              <td className="notice-author-cell">
                관리자
              </td>

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