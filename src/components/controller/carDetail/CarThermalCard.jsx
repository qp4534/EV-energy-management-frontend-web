import ThermalVideo from "@/components/controller/ThermalVideo";

export default function CarThermalCard({ carId }) {
  return (
    <div className="card flex h-full flex-col gap-2">
      <h2>실시간 열화상 영상</h2>
      <ThermalVideo carId={carId} />
    </div>
  );
}
