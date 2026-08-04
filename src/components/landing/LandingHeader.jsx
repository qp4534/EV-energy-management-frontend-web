import React from "react";
import { useNavigate } from "react-router-dom";
import { FiZap } from "react-icons/fi";
import useAuth, { clearAuth } from "../../hooks/common/useAuth";

export default function LandingHeader({ onLoginClick }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleClick = () => {
    if (isLoggedIn) {
      clearAuth();
      navigate("/");
      return;
    }
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
        onClick={handleClick}
      >
        {isLoggedIn ? "로그아웃" : "로그인"}
      </button>
    </header>
  );
}