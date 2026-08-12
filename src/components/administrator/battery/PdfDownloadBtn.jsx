import React from "react";

export default function PdfDownloadButton({ onClick, disabled }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border-none bg-[var(--color-primary-btn)] px-5 py-2.5 text-sm font-semibold text-[var(--color-header-text)] hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-base" aria-hidden="true">
        ⭳
      </span>
      {disabled ? "생성 중..." : "PDF Download"}
    </button>
  );
}
