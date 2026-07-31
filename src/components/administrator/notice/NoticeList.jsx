import React from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="w-full overflow-hidden">
      <table className="w-full table-fixed border-collapse">
        <tbody>
          {displayedNotices.map((notice) => (
            <tr
              key={notice.noticeId}
              onClick={() => goToDetail(notice.noticeId)}
              className="h-10 cursor-pointer border-b border-[#a9bda9]"
            >
              <td className="w-[62px] px-2 text-left align-middle text-sm text-[var(--color-sub-text)]">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
                    notice.isImportant
                      ? "bg-[var(--color-primary-btn)] text-[var(--color-header-text)]"
                      : "bg-[var(--color-footer-bg)] text-[var(--color-footer-desc)]"
                  }`}
                >
                  {notice.isImportant ? "중요" : "일반"}
                </span>
              </td>

              <td className="overflow-hidden px-2 text-left align-middle text-sm text-ellipsis whitespace-nowrap text-[var(--color-sub-text)]">
                {notice.title}
              </td>

              <td className="w-[70px] px-2 text-center align-middle text-sm whitespace-nowrap text-[var(--color-sub-text)]">
                관리자
              </td>

              <td className="w-[95px] px-2 text-right align-middle text-sm whitespace-nowrap text-[var(--color-sub-text)]">
                {notice.createdAt?.slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}