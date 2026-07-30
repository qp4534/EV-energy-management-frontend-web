import { useNavigate } from "react-router-dom";
import { RISK_LEVEL_COLOR } from "@/constants/carList.constants";
import StopChargingButton from "./StopChargingButton";

export default function CarVehicleRow({ car, onStopCharging }) {
  const navigate = useNavigate();

  const goToDetail = () => navigate(`/controller/cars/${car.carId}`);

  const handleStopClick = (e) => {
    e.stopPropagation(); // 행 클릭(상세 이동)으로 전파되지 않게 막음
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
        <StopChargingButton
          chargingStatus={car.chargingStatus}
          onClick={handleStopClick}
        />
      </td>
    </tr>
  );
}
