export default function VehicleInfoCard({ car }) {
  const rows = [
    { label: "모델", value: car.model },
    { label: "연식", value: car.year ? `${car.year}년` : "-" },
    { label: "차대번호(VIN)", value: car.vin },
  ];

  return (
    <div className="card flex h-full flex-col gap-3">
      <h2>차종 정보</h2>
      <dl className="flex flex-col gap-2">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between text-base"
          >
            <dt className="text-[var(--color-sub-text)]">{label}</dt>
            <dd className="font-medium text-[var(--color-header-text)]">
              {value ?? "-"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
