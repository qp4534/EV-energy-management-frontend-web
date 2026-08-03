import React from "react";

/**
 * 랜딩 페이지 특징 소개용 카드
 * icon: lucide-react 아이콘 컴포넌트를 그대로 전달 (예: <Flame />)
 * 다른 3~4개 특징 카드에도 그대로 재사용 가능합니다.
 */
export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-[var(--color-login-frame)] border border-[var(--color-border)] rounded-2xl py-[22px] px-5">
      {icon && (
        <span className="inline-flex text-[var(--color-header-text)] text-[26px] mb-3">
          {icon}
        </span>
      )}
      <h3 className="mb-1.5 text-[1.05rem] font-bold text-[var(--color-header-text)]">
        {title}
      </h3>
      <p className="m-0 text-[0.85rem] text-[var(--color-sub-text)] leading-[1.4]">
        {description}
      </p>
    </div>
  );
}