import React from "react";
import StatCardItem from "./StatCardItem";

export default function StatCardList() {
  return (
    <div className="card grid grid-cols-5 gap-4 w-full">
      <StatCardItem />
      <StatCardItem />
      <StatCardItem />
      <StatCardItem />
      <StatCardItem />
    </div>
  );
}
