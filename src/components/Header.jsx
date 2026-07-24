import React from "react";
import { FiZap, FiUser } from "react-icons/fi";
import "../styles/Header.css";

function Header({ role = "controller" }) {
  return (
    <header className="header">
      {/* 좌측: 서브 타이틀 & 로고 영역 */}
      <div className="header-left">
        <div className="logo">
          <FiZap className="logo-icon" />
          <span className="logo-text">MijungE</span>
        </div>
      </div>

      {/* 우측: 사용자 프로필 정보 영역 */}
      <div className="header-right">
        <div className="user-info">
          <div className="user-icon-bg">
            <FiUser />
          </div>
          <span className="user-name">
            {role === "admin" ? "최고 관리자" : "관제 운용자"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
