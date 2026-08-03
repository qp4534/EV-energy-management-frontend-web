import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * "섹션 제목 + 전체보기" 형태의 헤더
 * 공지사항 외에도 동일한 레이아웃이 필요한 섹션에서 재사용 가능합니다.
 */
export default function SectionHeader({ title, linkTo, linkLabel = "전체보기" }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-baseline justify-between mb-1">
      <h3 className="m-0 text-[1.15rem] font-bold text-[var(--color-header-text)]">
        {title}
      </h3>
      {linkTo && (
        <button
          type="button"
          className="bg-transparent border-none p-0 text-[0.8rem] text-[var(--color-btn-desc)] hover:text-[var(--color-sub-text)] transition-colors"
          onClick={() => navigate(linkTo)}
        >
          {linkLabel}
        </button>
      )}
    </div>
  );
}