import { useMemo, useState } from "react";
import TabBar from "../../components/administrator/common/TabBar";
import DataTable from "../../components/administrator/common/DataTable";
import Pagination from "../../components/common/Pagination";
import {
  MOCK_LOGIN_LOGS,
  MOCK_CAR_CHANGE_LOGS,
  MOCK_USER_ACTIVITY_LOGS,
  MOCK_ADMIN_ACTION_LOGS,
} from "../../mocks/logMock";
import "../../styles/administrator/LogManage.css";

const PAGE_SIZE = 10;

const POSITIVE_STATUS = new Set(["성공", "승인"]);
const NEGATIVE_STATUS = new Set(["실패", "반려"]);
const LOG_TABS = [
  { key: "login", label: "로그인 기록" },
  { key: "carChange", label: "차량 등록/변경" },
  { key: "userActivity", label: "이용자 활동" },
  { key: "adminAction", label: "관리자 작업" },
];

function StatusBadge({ status }) {
  if (POSITIVE_STATUS.has(status)) {
    return <span className="log-badge log-badge--positive">{status}</span>;
  }
  if (NEGATIVE_STATUS.has(status)) {
    return <span className="log-badge log-badge--negative">{status}</span>;
  }
  return <span className="log-badge">{status}</span>;
}

const TAB_CONFIG = {
  login: {
    data: MOCK_LOGIN_LOGS,
    searchPlaceholder: "이용자, IP로 검색",
    searchKeys: ["user", "ip"],
    showStatusFilter: true,
    columns: [
      { key: "user", header: "이용자" },
      { key: "datetime", header: "일시" },
      { key: "ip", header: "IP주소" },
      { key: "device", header: "기기/브라우저" },
      { key: "status", header: "상태", render: (row) => <StatusBadge status={row.status} /> },
      { key: "location", header: "위치" },
    ],
  },
  carChange: {
    data: MOCK_CAR_CHANGE_LOGS,
    searchPlaceholder: "차량 번호, 소유자로 검색",
    searchKeys: ["carNumber", "owner"],
    showStatusFilter: true,
    columns: [
      { key: "carNumber", header: "차량 번호" },
      { key: "owner", header: "소유자" },
      { key: "changeType", header: "변경 유형" },
      { key: "datetime", header: "일시" },
      { key: "status", header: "상태", render: (row) => <StatusBadge status={row.status} /> },
    ],
  },
  userActivity: {
    data: MOCK_USER_ACTIVITY_LOGS,
    searchPlaceholder: "이용자, 대상으로 검색",
    searchKeys: ["user", "target"],
    showStatusFilter: false,
    columns: [
      { key: "user", header: "이용자" },
      { key: "action", header: "액션" },
      { key: "target", header: "대상" },
      { key: "datetime", header: "일시" },
    ],
  },
  adminAction: {
    data: MOCK_ADMIN_ACTION_LOGS,
    searchPlaceholder: "관리자, 작업 내용으로 검색",
    searchKeys: ["admin", "action"],
    showStatusFilter: false,
    columns: [
      { key: "admin", header: "관리자" },
      { key: "action", header: "작업 내용" },
      { key: "target", header: "대상" },
      { key: "datetime", header: "일시" },
    ],
  },
};

export default function LogManage() {
  const [activeTab, setActiveTab] = useState("login");
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [statusValue, setStatusValue] = useState("all");
  const [page, setPage] = useState(1);

  const config = TAB_CONFIG[activeTab];

  const handleTabChange = (key) => {
    setActiveTab(key);
    setKeyword("");
    setAppliedKeyword("");
    setStatusValue("all");
    setPage(1);
  };

  const handleSearch = () => {
    setAppliedKeyword(keyword);
    setPage(1);
  };

  const filteredRows = useMemo(() => {
    return config.data.filter((row) => {
      const matchesKeyword =
        !appliedKeyword ||
        config.searchKeys.some((key) =>
          String(row[key] ?? "").toLowerCase().includes(appliedKeyword.toLowerCase()),
        );
      const matchesStatus =
        statusValue === "all" ||
        (statusValue === "success" && POSITIVE_STATUS.has(row.status)) ||
        (statusValue === "fail" && NEGATIVE_STATUS.has(row.status));
      return matchesKeyword && matchesStatus;
    });
  }, [config, appliedKeyword, statusValue]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="log-manage">
      <div className="log-manage-header">
        <h2>로그 관리</h2>

        <TabBar tabs={LOG_TABS} activeTab={activeTab} onChange={handleTabChange} />

        <div className="log-search-bar">
          {config.showStatusFilter && (
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="log-search-select"
            >
              <option value="all">전체 상태</option>
              <option value="success">정상 (성공/승인)</option>
              <option value="fail">실패/반려</option>
            </select>
          )}
          <input
            type="text"
            placeholder={config.searchPlaceholder}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="log-search-input"
          />
          <button className="log-search-btn" onClick={handleSearch}>
            검색
          </button>
        </div>
      </div>

      <DataTable columns={config.columns} rows={pageRows} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
