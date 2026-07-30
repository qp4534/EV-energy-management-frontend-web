import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

/**
 * 페이지 번호를 버튼으로 나열하지 않고, 직접 입력해서 이동하는 방식.
 * 가운데 입력칸에 숫자를 넣고 Enter(또는 포커스 아웃)하면 해당 페이지로 이동한다.
 * 마지막 페이지를 모를 수 있으니 "현재 / 전체" 형태로 옆에 표시한다. (예: 4 / 40)
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const [inputValue, setInputValue] = useState(String(currentPage));

  // 외부(이전/다음 버튼, 필터 변경 등)에서 currentPage가 바뀌면 입력칸도 동기화
  useEffect(() => {
    setInputValue(String(currentPage));
  }, [currentPage]);

  if (totalPages <= 0) return null;

  const commit = () => {
    const parsed = Number(inputValue);
    if (!Number.isInteger(parsed) || parsed < 1) {
      setInputValue(String(currentPage));
      return;
    }
    const clamped = Math.min(parsed, totalPages);
    if (clamped === currentPage) {
      setInputValue(String(currentPage));
      return;
    }
    onPageChange(clamped);
  };

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-sub-text)] disabled:opacity-30"
      >
        <HiChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1 text-sm">
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur(); // blur에서 commit 처리
          }}
          aria-label="이동할 페이지 번호"
          className="h-8 w-12 rounded-md border border-[var(--color-border)] text-center font-semibold text-[var(--color-header-text)] outline-none focus:border-[var(--color-primary-btn)]"
        />
        <span className="text-[var(--color-sub-text)]">/ {totalPages}</span>
      </div>

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-sub-text)] disabled:opacity-30"
      >
        <HiChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
