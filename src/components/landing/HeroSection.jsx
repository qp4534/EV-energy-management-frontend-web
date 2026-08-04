import React from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "./LandingHeader";

/**
 * 랜딩 페이지 최상단 히어로 배너
 * title: 두 줄로 노출되는 메인 카피 (배열로 전달하면 줄바꿈됨)
 * ctaTo: '관제 시작하기' 버튼 클릭 시 이동할 경로
 */
export default function HeroSection({
  title = ["열화상 이상감지와 SOH 예측으로", "안전한 EV 에너지 관리"],
  description = "실시간 화재 위험 감지부터 배터리 수명 예측까지, 하나의 플랫폼으로 관리하세요.",
  ctaLabel = "관제 시작하기",
  ctaTo = "/controller",
}) {
  const navigate = useNavigate();

  return (
    <section className="bg-[var(--color-header-text)] rounded-b-[20px] sm:rounded-b-[28px] px-5 sm:px-10 pt-4 sm:pt-5 pb-9 sm:pb-12">
      <LandingHeader />

      <div className="mt-9 max-w-[640px]">
        <h1 className="flex flex-col m-0 text-white text-2xl sm:text-[1.9rem] font-extrabold leading-[1.35]">
          {title.map((line) => (
            <span key={line} className="whitespace-normal sm:whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-3.5 text-[#d7e3da] text-[0.95rem] leading-relaxed">
          {description}
        </p>

        <button
          type="button"
          className="mt-6 bg-[var(--color-primary-btn)] text-[var(--color-header-text)] border-none rounded-full py-3 px-6 text-[0.95rem] font-bold transition-[filter] duration-150 hover:brightness-95"
          onClick={() => navigate(ctaTo)}
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}