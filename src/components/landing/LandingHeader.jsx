import React from "react";
import { useNavigate } from "react-router-dom";
import { FiZap } from "react-icons/fi";

/**
 * 랜딩(메인) 페이지 전용 헤더
 * - 내부 대시보드 Header.jsx와 달리 로그인 전 방문자에게 노출되는 헤더입니다.
 * - 어두운 초록 히어로 배경 위에 올라가므로 배경은 투명하게 둡니다.
 */
export default function LandingHeader({ onLoginClick }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
      return;
    }
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FiZap className="text-[22px] text-[var(--color-primary-btn)] -rotate-[10deg]" />
        <span className="text-[20px] font-extrabold text-white tracking-[-0.3px]">
          MijungE
        </span>
      </div>

      <button
        type="button"
        className="bg-[var(--color-primary-btn)] text-[var(--color-header-text)] border-none rounded-full py-2 px-5 text-sm font-bold transition-[filter] duration-150 hover:brightness-95"
        onClick={handleLogin}
      >
        로그인
      </button>
    </header>
  );
}