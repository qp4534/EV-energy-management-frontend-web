import React from "react";
import CardShell from "../common/CardShell";
import DonutStat from "../common/DonutStat";

export default function UserCard({
  title = "이용자",
  ownerData = [],
  operatorData = [],
}) {
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
          <DonutStat title="차주" data={ownerData} />
          <DonutStat title={["관리자", "관제자"]} data={operatorData} />
        </div>
      </div>
    </CardShell>
  );
}