import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { useCarDetail, useStopCharging } from "@/hooks/queries/useCar";
import { useReportList } from "@/hooks/queries/useReport";
import { RISK_LEVEL_COLOR } from "@/constants/carList.constants";
import { REPORT_RISK_BADGE_LABEL } from "@/constants/report.constants";
import CarDigitalTwinCard from "@/components/controller/carDetail/CarDigitalTwinCard";
import VehicleInfoCard from "@/components/controller/carDetail/VehicleInfoCard";
import BatteryPassportCard from "@/components/controller/carDetail/BatteryPassportCard";
import StatusCard from "@/components/controller/carDetail/StatusCard";
import LocationCard from "@/components/controller/carDetail/LocationCard";
import ReportList from "@/components/controller/report/ReportList";
import ExpandButton from "@/components/ExpandButton";
import LoadingIndicator from "@/components/common/LoadingIndicator";

export default function CarDetail() {
  // 라우트가 "/controller/cars/:id"이므로 파라미터 이름이 id다 (carId 아님, AiReportDetail과 동일한 이슈)
  const { id: carId } = useParams();
  const navigate = useNavigate();

  const { data: car, isLoading, isError } = useCarDetail(carId);
  const stopChargingMutation = useStopCharging();

  // AI 보고서 카드: 이 차량 것만, 최신 5개. 페이지네이션 없이 그대로 노출하고
  // "더보기"는 ExpandButton으로 /controller/cars/:id/reports 전체 목록 페이지로 유도한다.
  const { data: reportData, isLoading: isReportLoading } = useReportList({
    carId,
    page: 1,
    pageSize: 5,
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError || !car) {
    return (
      <p className="p-6 text-sm text-red-500">차량 정보를 찾을 수 없습니다.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex w-fit items-center gap-1 text-sm text-[var(--color-sub-text)] hover:text-[var(--color-header-text)]"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          목록으로
        </button>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold text-white ${RISK_LEVEL_COLOR[car.riskLevel]}`}
          >
            {REPORT_RISK_BADGE_LABEL[car.riskLevel] ?? car.riskLevel}
          </span>
          <h2 className="text-2xl font-bold text-[var(--color-header-text)]">
            {car.carNumber}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CarDigitalTwinCard mode="live" vehicleId={car.carId} />
        <CarDigitalTwinCard mode="history" vehicleId={car.carId} />
      </div>

      <div>
        <VehicleInfoCard car={car} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch">
        <BatteryPassportCard carId={car.carId} />
        <div className="flex flex-col gap-4">
          <StatusCard
            car={car}
            onStopCharging={() => stopChargingMutation.mutate(car.carId)}
          />
          <LocationCard carId={car.carId} riskLevel={car.riskLevel} />
        </div>
      </div>

      <div className="card flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2>AI 보고서</h2>
          <ExpandButton to={`/controller/cars/${car.carId}/reports`} />
        </div>
        <ReportList
          reports={reportData?.items ?? []}
          isLoading={isReportLoading}
          showCarNumber={false}
        />
      </div>
    </div>
  );
}
