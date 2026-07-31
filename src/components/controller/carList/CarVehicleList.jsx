import CarVehicleRow from "./CarVehicleRow";

const COLUMNS = [
  "위험도",
  "차량번호",
  "위치",
  "이상 유형",
  "충전 시간",
  "충전 상태",
  "",
];

export default function CarVehicleList({ cars, isLoading, onStopCharging }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b-2 border-[var(--color-header-text)] text-sm font-bold text-[var(--color-header-text)]">
          {COLUMNS.map((col) => (
            <th key={col} className="py-3">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td
              colSpan={COLUMNS.length}
              className="py-10 text-center text-sm text-[var(--color-btn-desc)]"
            >
              불러오는 중...
            </td>
          </tr>
        ) : cars.length === 0 ? (
          <tr>
            <td
              colSpan={COLUMNS.length}
              className="py-10 text-center text-sm text-[var(--color-btn-desc)]"
            >
              조건에 맞는 차량이 없습니다.
            </td>
          </tr>
        ) : (
          cars.map((car) => (
            <CarVehicleRow
              key={car.carId}
              car={car}
              onStopCharging={onStopCharging}
            />
          ))
        )}
      </tbody>
    </table>
  );
}
