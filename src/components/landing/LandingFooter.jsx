import React from "react";

export default function LandingFooter() {
  return (
    <footer className="bg-[var(--color-footer-bg)] border-t border-[var(--color-footer-border)] py-5 px-10 pb-7">
      <div className="flex items-center gap-2.5">
        <span className="text-[0.8rem] font-semibold text-[#4a4a4a] cursor-pointer hover:underline">
          개인정보처리방침
        </span>
        <span className="text-[var(--color-border)] text-[0.75rem]">|</span>
        <span className="text-[0.8rem] font-semibold text-[#4a4a4a] cursor-pointer hover:underline">
          이용약관
        </span>
      </div>
      <p className="mt-2.5 mb-0 text-[0.78rem] font-semibold text-[var(--color-footer-desc)]">
        © 2026 MijungE. EV energy resource management platform
      </p>
    </footer>
  );
}