import React from "react";
import { useNavigate } from "react-router-dom";

// createdAt("2026-07-14T00:00:00Z") -> "26/07/14"
function formatShortDate(isoString) {
  const date = new Date(isoString);
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}/${mm}/${dd}`;
}

/**
 * 제목 + 날짜만 노출하는 간단한 공지사항 목록 (랜딩 페이지용)
 * 관리자 대시보드의 NoticeList.jsx(중요도 뱃지 포함)와는 별도의
 * 가벼운 버전으로, 방문자에게 노출되는 화면에 재사용합니다.
 */
export default function NoticePreviewList({ notices = [], limit = 3, onSelect }) {
  const navigate = useNavigate();

  const displayedNotices = [...notices]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

  const handleClick = (notice) => {
    if (onSelect) {
      onSelect(notice);
      return;
    }
    navigate(`/notices/${notice.noticeId}`);
  };

  return (
    <ul className="list-none m-0 mt-2 p-0">
      {displayedNotices.map((notice) => (
        <li
          key={notice.noticeId}
          className="flex items-center justify-between gap-4 py-3.5 px-1 border-b border-[var(--color-border)] cursor-pointer group"
          onClick={() => handleClick(notice)}
        >
          <span className="text-[0.92rem] text-[#333333] overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-[var(--color-header-text)] group-hover:underline">
            {notice.title}
          </span>
          <span className="shrink-0 text-[0.8rem] text-[var(--color-btn-desc)]">
            {formatShortDate(notice.createdAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}