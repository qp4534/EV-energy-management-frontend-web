import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import { useNotices } from "../../hooks/queries/useNotice";
import "../../styles/administrator/NoticeManage.css";

const PAGE_SIZE = 10;

// "2026-08-01T03:58:56Z" -> "2026-08-01 12:58" (로컬 시간 기준, T/Z 제거하고 나란히 표시)
const formatNoticeDate = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "-";
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `${date} ${time}`;
};

function NoticeManage() {
  const { data, isLoading, error } = useNotices();
  const notices = data ?? [];

  const [searchType, setSearchType] = useState("통합검색");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filtered = notices.filter((n) =>
    n.title.includes(keyword) || n.content.includes(keyword)
  );

  // 상단 고정(isPinned)인 공지를 먼저, 그 다음은 등록일(createdAt) 최신순으로 정렬.
  // 백엔드가 정렬해서 주지 않아서 프론트에서 처리.
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = () => setPage(1);

  return (
    <div className="notice-manage">
      <div className="notice-manage-header">
        <div className="notice-header-top">
          <h2>공지사항</h2>
          <button
            className="notice-create-btn"
            onClick={() => navigate("/admin/notices/new")}
          >
            + 공지사항 작성
          </button>
        </div>
        <div className="notice-search-bar">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select"
          >
            <option value="통합검색">통합검색</option>
            <option value="제목">제목</option>
            <option value="내용">내용</option>
          </select>
          <input
            type="text"
            placeholder="검색어 입력"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="search-input"
          />
          <button className="search-btn" onClick={handleSearch}>
            검색
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="notice-empty">불러오는 중...</div>
      ) : error ? (
        <div className="notice-empty">공지사항을 불러오지 못했습니다.</div>
      ) : (
        <>
          <table className="notice-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>중요/일반</th>
                <th>등록 일자</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="notice-empty">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              ) : (
                pageData.map((n, idx) => (
                  <tr
                    key={n.noticeId}
                    className={n.isRead ? "notice-row-read" : "notice-row-unread"}
                    onClick={() => navigate(`/admin/notices/${n.noticeId}`)}
                  >
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="notice-title-cell">{n.title}</td>
                    <td>
                      <span
                        className={
                          n.isImportant ? "badge-important" : "badge-normal"
                        }
                      >
                        {n.isImportant ? "중요" : "일반"}
                      </span>
                    </td>
                    <td>{formatNoticeDate(n.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default NoticeManage;