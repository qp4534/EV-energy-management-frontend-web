import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
//import { MOCK_NOTICES } from "../../mocks/noticeMock";
import { getNotices } from '../../services/noticeService';
import "../../styles/administrator/NoticeManage.css";

const PAGE_SIZE = 10;

function NoticeManage() {
  const [notices, setNotices] = useState([]);
  const [searchType, setSearchType] = useState("통합검색");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // useEffect(() => {
  //   setNotices(MOCK_NOTICES);
  // }, []);

  useEffect(() => {
  getNotices().then(setNotices).catch(console.error);
}, []);

  const filtered = notices.filter((n) =>
    n.title.includes(keyword) || n.content.includes(keyword)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
                onClick={() => navigate(`/admin/notices/${n.noticeId}`)}
              >
                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td className="notice-title-cell">{n.title}</td>
                <td>
                  <span
                    className={
                      n.isPinned ? "badge-important" : "badge-normal"
                    }
                  >
                    {n.isPinned ? "중요" : "일반"}
                  </span>
                </td>
                <td>{n.createdAt}</td>
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
    </div>
  );
}

export default NoticeManage;