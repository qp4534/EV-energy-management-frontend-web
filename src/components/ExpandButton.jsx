import React from "react";
import { useNavigate } from "react-router-dom";
import { SlDirections } from "react-icons/sl";
import { FiMaximize2 } from "react-icons/fi";

export default function ExpandButton({
  to,
  onClick,
  ariaLabel = "확대하여 보기",
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }

    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className="p-1.5 hover:text-gray-400 transition-colors cursor-pointer"
    >
      <FiMaximize2 className="w-5 h-5" />
    </button>
  );
}
