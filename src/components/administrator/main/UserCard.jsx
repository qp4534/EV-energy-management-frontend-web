import React from "react";
import CardShell from "../common/CardShell";
import DonutStat from "../common/DonutStat";
import { useCarModelDistribution, useUserRoleDistribution } from "../../../hooks/queries/useDashboard";

const CAR_COLORS = ["#A8F56B", "#527E5B", "#7FB77E", "#3E6B4F", "#C9E4B5"];
const ROLE_COLORS = { 관리자: "#FFE88A", 관제자: "#FF8D72" };

export default function UserCard({ title = "이용자" }) {
  const { data: carModels } = useCarModelDistribution();
  const { data: roles } = useUserRoleDistribution();

  const ownerData = (carModels ?? []).map((c, idx) => ({
    name: c.model,
    value: c.count,
    color: CAR_COLORS[idx % CAR_COLORS.length],
  }));

  const operatorData = (roles ?? []).map((r) => ({
    name: r.role,
    value: r.count,
    color: ROLE_COLORS[r.role] ?? "#cccccc",
  }));

  return (
    <CardShell title={title}>
      <div className="w-full min-h-[250px] box-border">
        <div
          className="
            grid grid-cols-2 items-start w-full box-border
            gap-10 pt-3 px-5 pb-[18px]
            max-[1200px]:gap-6 max-[1200px]:px-3
            max-[700px]:grid-cols-1 max-[700px]:gap-[30px]
          "
        >
          <DonutStat title="보유 차량" data={ownerData} unit="대" />
          <DonutStat title={["관리자", "관제자"]} data={operatorData} />
        </div>
      </div>
    </CardShell>
  );
}