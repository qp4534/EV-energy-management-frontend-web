import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiZap, FiUser, FiLogOut } from "react-icons/fi";
import useAuth, { clearAuth } from "../hooks/common/useAuth";
import { userService } from "../services/userService";
import "../styles/Header.css";

function Header({ role = "controller" }) {
  const navigate = useNavigate();
  const { isLoggedIn, role: authRole } = useAuth();

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate(authRole === "administrator" ? "/administrator" : "/controller");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      await userService.logout();
    } catch (e) {
      // 네트워크/서버 오류가 나도 로컬 로그아웃은 진행한다
    }
    clearAuth();
    navigate("/");
  };

  return (
    <header className="header">
      {/* 좌측: 서브 타이틀 & 로고 영역 */}
      <div className="header-left">
        <button type="button" className="logo" onClick={handleLogoClick}>
          <FiZap className="logo-icon" />
          <span className="logo-text">MijungE</span>
        </button>
      </div>

      {/* 우측: 사용자 프로필 정보 영역 */}
      <div className="header-right">
        <Link to="/mypage" className="user-info">
          <div className="user-icon-bg">
            <FiUser />
          </div>
          <span className="user-name">
            {role === "administrator" ? "관리 운용자" : "관제 운용자"}
          </span>
        </Link>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          <FiLogOut />
          로그아웃
        </button>
      </div>
    </header>
  );
}

export default Header;