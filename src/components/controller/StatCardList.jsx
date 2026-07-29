import React from "react";
import StatCardItem from "./StatCardItem";
import { useCarStats } from "@/hooks/queries/useCar";

export default function StatCardList() {
  const { data: stats, isLoading, isError } = useCarStats();

  const cardConfigs = [
    { key: "total", title: "전체 차량", count: stats?.total, type: "total" },
    {
      key: "emergency",
      title: "긴급 차량",
      count: stats?.emergency,
      type: "emergency",
    },
    {
      key: "warning",
      title: "경고 차량",
      count: stats?.warning,
      type: "warning",
    },
    {
      key: "caution",
      title: "주의 차량",
      count: stats?.caution,
      type: "caution",
    },
    { key: "normal", title: "정상 차량", count: stats?.normal, type: "normal" },
  ];
  return (
    <div className="card grid grid-cols-5 gap-4 w-full">
      {cardConfigs.map((card) => (
        <StatCardItem
          key={card.key}
          title={card.title}
          count={card.count}
          type={card.type}
        />
      ))}
    </div>
  );
}
