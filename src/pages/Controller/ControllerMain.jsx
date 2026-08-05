// 관제자 메인 대시 보드
import StatCardList from "../../components/controller/StatCardList";
import MapCard from "../../components/controller/MapCard";
import ChartCard from "../../components/controller/ChartCard";
import CarTableCard from "../../components/controller/CarTableCard";
import CarDigitalTwinCard from "../../components/controller/carDetail/CarDigitalTwinCard";

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

      <section className="dashboard-row">
        <CarTableCard />
      </section>

      <section className="dashboard-grid grid-2col">
        <CarDigitalTwinCard mode="live" />
        <CarDigitalTwinCard mode="history" />
      </section>
    </div>
  );
}
