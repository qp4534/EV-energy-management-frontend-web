import React from "react";
import { FaGasPump } from "react-icons/fa";
import { FaCar } from "react-icons/fa6";

const LEGEND_ITEMS = [
  {
    key: "station",
    icon: <FaGasPump className="text-white text-base" />,
    color: "bg-[#547963]",
    label: "충전소",
  },
  {
    key: "danger",
    icon: <FaCar className="text-white" />,
    color: "bg-[#FF0000]",
    label: "긴급 차량",
  },
  {
    key: "warning",
    icon: <FaCar className="text-white" />,
    color: "bg-[#FF9900]",
    label: "경고 차량",
  },
  {
    key: "caution",
    icon: <FaCar className="text-white" />,
    color: "bg-[#FFDD33]",
    label: "주의 차량",
  },
];

export default function MapLegend({ activeFilters, onToggle }) {
  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      {LEGEND_ITEMS.map(({ key, icon, color, label }) => {
        const isActive = activeFilters[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition
              ${isActive ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200 opacity-50"}`}
          >
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-full ${color} ${
                isActive ? "" : "grayscale"
              }`}
            >
              {icon}
            </span>
            <span className={isActive ? "text-gray-800" : "text-gray-400"}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
