import { useNavigate } from "react-router-dom";
import { RISK_LEVEL_COLOR } from "@/constants/carList.constants";

export default function CarVehicleRow({ car, onStopCharging }) {
  const navigate = useNavigate();
  const isStoppable = car.chargingStatus === "충전 중";

  const goToDetail = () => navigate(`/cars/${car.carId}`);

  const handleStopClick = (e) => {
    e.stopPropagation();
    onStopCharging(car.carId);
  };

  return (
    <tr
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetail();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${car.carNumber} 상세 정보 보기`}
      className="cursor-pointer border-b border-[var(--color-border)] text-center text-sm hover:bg-[var(--color-bg-main)] focus:outline focus:outline-2 focus:outline-[var(--color-primary-btn)]"
    >
      <td className="py-3">
        <span
          className={`mx-auto block h-5 w-10 rounded-sm ${RISK_LEVEL_COLOR[car.riskLevel]}`}
        />
      </td>
      <td className="py-3 font-medium text-[var(--color-header-text)]">
        {car.carNumber}
      </td>
      <td className="py-3 text-[var(--color-sub-text)]">{car.region}</td>
      <td className="py-3 text-[var(--color-sub-text)]">{car.abnormalType}</td>
      <td className="py-3 text-[var(--color-sub-text)]">{car.chargingTime}</td>
      <td className="py-3 text-[var(--color-sub-text)]">
        {car.chargingStatus}
      </td>
      <td className="py-3">
        <button
          type="button"
          disabled={!isStoppable}
          onClick={handleStopClick}
          className={
            isStoppable
              ? "rounded-md border border-[var(--color-primary-btn)] bg-[var(--color-footer-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-header-text)] hover:bg-[var(--color-primary-btn)]"
              : "cursor-not-allowed rounded-md border border-[var(--color-border)] bg-[var(--color-bg-main)] px-3 py-1 text-xs font-semibold text-[var(--color-btn-desc)]"
          }
        >
          {isStoppable ? "충전 중단" : "중단 완료"}
        </button>
      </td>
    </tr>
  );
}
