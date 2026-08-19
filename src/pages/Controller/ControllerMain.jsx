// 관제자 메인 대시 보드
import StatCardList from "../../components/controller/StatCardList";
import MapCard from "../../components/controller/MapCard";
import ChartCard from "../../components/controller/ChartCard";
import CarTableCard from "../../components/controller/CarTableCard";
import CarDigitalTwinCard from "../../components/controller/carDetail/CarDigitalTwinCard";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import {
  useCarSummaryList,
  useCarStats,
  useCarList,
  useDailyDangerCarCount,
} from "../../hooks/queries/useCar";
import { useStations } from "../../hooks/queries/useCharging";

import "../../styles/controller/ControllerMain.css";

export default function ControllerMain() {
  const { data: summaryCars, isLoading: isSummaryLoading } = useCarSummaryList();
  const { isLoading: isStatsLoading } = useCarStats();
  const { isLoading: isStationsLoading } = useStations();
  const { isLoading: isVehiclesLoading } = useCarList();
  const { isLoading: isChartLoading } = useDailyDangerCarCount();
  const firstCarId = summaryCars?.[0]?.carId;

  // 카드마다 따로 스피너를 띄우는 대신, 대시보드에 처음 들어왔을 때(각 쿼리의
  // isLoading)만 한 번에 묶어서 보여준다. 폴링으로 인한 재요청(isFetching)은
  // 여기 안 걸리므로 이후 자동 갱신 때는 화면이 깜빡이지 않는다.
  // CarDigitalTwinCard는 자체 3D 스트림 로딩이라 따로 두고 여기서는 뺀다.
  const isDashboardLoading =
    isSummaryLoading ||
    isStatsLoading ||
    isStationsLoading ||
    isVehiclesLoading ||
    isChartLoading;

  if (isDashboardLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

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

      {firstCarId && (
        <section className="dashboard-grid grid-2col">
          <CarDigitalTwinCard mode="live" vehicleId={firstCarId} />
          <CarDigitalTwinCard mode="history" vehicleId={firstCarId} />
        </section>
      )}
    </div>
  );
}
