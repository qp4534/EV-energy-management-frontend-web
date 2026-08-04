import React, { useState } from "react";
import TermsModal from "../auth/TermsModal";

export default function LandingFooter() {
  // "privacy" | "service" | "location" | null
  const [modalType, setModalType] = useState(null);

  return (
    <footer className="bg-[var(--color-footer-bg)] border-t border-[var(--color-footer-border)] py-5 px-10 pb-7">
      <div className="flex items-center gap-2.5">
        <span
          className="text-[0.8rem] font-semibold text-[#4a4a4a] cursor-pointer hover:underline"
          onClick={() => setModalType("privacy")}
        >
          개인정보처리방침
        </span>
        <span className="text-[var(--color-border)] text-[0.75rem]">|</span>
        <span
          className="text-[0.8rem] font-semibold text-[#4a4a4a] cursor-pointer hover:underline"
          onClick={() => setModalType("service")}
        >
          이용약관
        </span>
        <span className="text-[var(--color-border)] text-[0.75rem]">|</span>
        <span
          className="text-[0.8rem] font-semibold text-[#4a4a4a] cursor-pointer hover:underline"
          onClick={() => setModalType("location")}
        >
          위치기반서비스 이용약관
        </span>
      </div>
      <p className="mt-2.5 mb-0 text-[0.78rem] font-semibold text-[var(--color-footer-desc)]">
        © 2026 MijungE. EV energy resource management platform
      </p>

      {modalType && (
        <TermsModal
          initialType={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </footer>
  );
}