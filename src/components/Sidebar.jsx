import React from "react";
import { NavLink } from "react-router-dom";
// 'react-icons/fi' 모듈 사용 (Fi 접두사)
import {
  FiGrid,
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiBell,
  FiFileText,
  FiSettings,
} from "react-icons/fi";
import "../styles/Sidebar.css";

function Sidebar({ role = "controller" }) {
  return (
    <aside className="sidebar">
      <div className="menu-group">
        {/* 상단 뷰 분할 아이콘 */}
        <button className="sidebar-icon-btn grid-btn" title="레이아웃 보기">
          <FiGrid />
        </button>

        {/* --- 1. 관제자 메뉴 (role === 'controller') --- */}
        {role === "controller" && (
          <nav className="nav-list">
            <NavLink
              to="/controller"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="홈"
            >
              <FiHome />
            </NavLink>
            <NavLink
              to="/controller/stat"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="통계/차트"
            >
              <FiTrendingUp />
            </NavLink>
            <NavLink
              to="/controller/vehicles"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="차량 관리"
            >
              <FiUsers />
            </NavLink>
            <NavLink
              to="/controller/notice"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="알림/공지"
            >
              <FiBell />
            </NavLink>
            <NavLink
              to="/controller/reports"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="보고서"
            >
              <FiFileText />
            </NavLink>
          </nav>
        )}

        {/* --- 2. 관리자 메뉴 (role === 'admin') --- */}
        {role === "admin" && (
          <nav className="nav-list">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="관리자 홈"
            >
              <FiHome />
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="사용자 계정 관리"
            >
              <FiUsers />
            </NavLink>
            <NavLink
              to="/admin/logs"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              title="시스템 로그"
            >
              <FiFileText />
            </NavLink>
          </nav>
        )}
      </div>

      {/* 하단 고정 메뉴 (설정) */}
      <div className="sidebar-bottom">
        <NavLink
          to={role === "admin" ? "/admin/settings" : "/controller/settings"}
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          title="설정"
        >
          <FiSettings />
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
