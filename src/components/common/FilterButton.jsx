import { useEffect, useRef, useState } from "react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

export default function FilterButton({
  children,
  icon: Icon = HiOutlineAdjustmentsHorizontal,
  align = "left",
  panelClassName = "",
  buttonClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="검색 조건"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-login-frame)] text-[var(--color-sub-text)] hover:bg-[var(--color-bg-main)] ${buttonClassName}`}
      >
        <Icon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className={`absolute z-20 mt-2 w-80 rounded-2xl border border-[var(--color-primary-btn)] bg-[var(--color-login-frame)] p-4 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          } ${panelClassName}`}
        >
          {typeof children === "function" ? children({ close }) : children}
        </div>
      )}
    </div>
  );
}
