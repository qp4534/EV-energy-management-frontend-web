// 관제자 메인 대시 보드
import React from "react";
import StatCardList from "../../components/controller/StatCardList";
import MapCard from "../../components/controller/MapCard";
import ChartCard from "../../components/controller/ChartCard";
import RiskVehicleTableCard from "../../components/controller/RiskVehicleTableCard";
import ThermalVideoCard from "../../components/controller/ThermalVideoCard";

import "../../styles/controller/ControllerMain.css";

export default function ControllerMain() {
  return (
    <div className="controller-main-container">
      <section className="dashboard-row top-stat-section">
        <StatCardList />
      </section>

      <section className="dashboard-grid grid-2col">
        <MapCard />
        <ChartCard />
      </section>

      <section className="dashboard-grid grid-2col">
        <RiskVehicleTableCard />
        <ThermalVideoCard />
      </section>
    </div>
  );
}
