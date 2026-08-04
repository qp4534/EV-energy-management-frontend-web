import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// 'react-icons/fi' 모듈 사용 (Fi 접두사)
import {
  FiSidebar,
  FiHome,
  FiVolume2,
  FiTrendingUp,
  FiUsers,
  FiBell,
  FiFileText,
  FiSettings,
} from "react-icons/fi";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdCarCrash } from "react-icons/md";
import { MdBatteryChargingFull } from "react-icons/md";
import "../styles/Sidebar.css";

function Sidebar({ role = "controller" }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <div className="sidebar-header">
        <button
          className="sidebar-icon-btn grid-btn"
          title="사이드바 열기/닫기"
          onClick={toggleSidebar}
        >
          <FiSidebar />
        </button>
      </div>

      <div className="sidebar-divider" />

      <div className="menu-group">
        {/* --- 1. 관제자 메뉴 (role === 'controller') --- */}
        {role === "controller" && (
          <nav className="nav-list">
            <NavLink
              to="/controller"
              end
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="홈"
            >
              <FiHome />
              {isExpanded && <span className="nav-label">홈</span>}
            </NavLink>
            <NavLink
              to="/controller/map"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="지도"
            >
              <FaMapMarkedAlt />
              {isExpanded && <span className="nav-label">지도</span>}
            </NavLink>
            <NavLink
              to="/controller/cars"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="위험차량"
            >
              <MdCarCrash />
              {isExpanded && <span className="nav-label">위험차량</span>}
            </NavLink>
            <NavLink
              to="/controller/reports"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="AI 보고서"
            >
              <FiFileText />
              {isExpanded && <span className="nav-label">AI 보고서</span>}
            </NavLink>
          </nav>
        )}

        {/* --- 2. 관리자 메뉴 (role === 'administrator') --- */}
        {role === "administrator" && (
          <nav className="nav-list">
            <NavLink
              to="/administrator"
              end
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="홈"
            >
              <FiHome />
              {isExpanded && <span className="nav-label">홈</span>}
            </NavLink>

            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="통계 / 리포트 조회"
            >
              <FiTrendingUp />
              {isExpanded && (
                <span className="nav-label">통계 / 리포트 조회</span>
              )}
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="회원 관리"
            >
              <FiUsers />
              {isExpanded && <span className="nav-label">회원 관리</span>}
            </NavLink>

            <NavLink
              to="/admin/notices"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="공지사항 관리"
            >
              <FiVolume2 />
              {isExpanded && <span className="nav-label">공지사항 관리</span>}
            </NavLink>

            <NavLink
              to="/admin/logs"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="로그 관리"
            >
              <FiFileText />
              {isExpanded && <span className="nav-label">로그 관리</span>}
            </NavLink>
            <NavLink
              to="/admin/battery"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="배터리 관리"
            >
              <MdBatteryChargingFull />
              {isExpanded && <span className="nav-label">배터리 관리</span>}
            </NavLink>
          </nav>
        )}
      </div>

      {role === "administrator" && (
        <div className="sidebar-bottom">
          <NavLink
            to={
              role === "administrator"
                ? "/admin/system"
                : "/controller/settings"
            }
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            title="시스템 설정"
          >
            <FiSettings />
            {isExpanded && <span className="nav-label">시스템 설정</span>}
          </NavLink>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
