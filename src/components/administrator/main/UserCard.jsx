import React from "react";
import CardShell from "../common/CardShell";
import DonutStat from "../common/DonutStat";
import "../../../styles/administrator/components/UserCard.css";

export default function UserCard({
  title = "이용자",
  ownerData = [],
  operatorData = [],
}) {
  return (
    <CardShell title={title}>
      <div className="user-card">
        <div className="user-card-content">
          <DonutStat
            title="차주"
            data={ownerData}
          />

          <DonutStat
            title={["관리자", "관제자"]}
            data={operatorData}
          />
        </div>
      </div>
    </CardShell>
  );
}