function niceBounds(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = 5;
  const lower = Math.floor(min / step) * step - step;
  const upper = Math.ceil(max / step) * step + step;
  return { lower, upper, step };
}

export default function LineChartSection({ section }) {
  const heading = section.title ?? section.heading;
  const unit = section.unit ?? "";
  const dataset = section.datasets?.[0];
  const datasetValues = dataset?.data ?? dataset?.values ?? [];
  const series = Array.isArray(section.series)
    ? section.series
    : (section.labels ?? [])
        .map((label, index) => ({
          label,
          value: Number(datasetValues[index]),
        }))
        .filter((point) => Number.isFinite(point.value));

  if (series.length === 0) {
    return (
      <section className="card">
        <h3 className="mb-2 text-base font-bold text-[var(--color-header-text)]">
          {heading}
        </h3>
        <p className="text-sm text-[var(--color-btn-desc)]">
          데이터가 없습니다.
        </p>
      </section>
    );
  }
  const width = 700;
  const height = 260;
  const padding = { top: 10, right: 16, bottom: 30, left: 40 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const values = series.map((p) => p.value);
  const { lower, upper, step } = niceBounds(values);

  const xFor = (i) =>
    padding.left + (innerW * i) / Math.max(series.length - 1, 1);
  const yFor = (v) =>
    padding.top + innerH - ((v - lower) / (upper - lower)) * innerH;

  const linePoints = series
    .map((p, i) => `${xFor(i)},${yFor(p.value)}`)
    .join(" ");
  const areaPoints = `${xFor(0)},${yFor(lower)} ${linePoints} ${xFor(series.length - 1)},${yFor(lower)}`;

  const gridLines = [];
  for (let v = lower; v <= upper; v += step) gridLines.push(v);

  return (
    <section className="card">
      <h3 className="mb-3 text-base font-bold text-[var(--color-header-text)]">
        {heading}
      </h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={heading}
      >
        {gridLines.map((v) => (
          <g key={v}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={yFor(v)}
              y2={yFor(v)}
              stroke="var(--color-border)"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={yFor(v) + 4}
              textAnchor="end"
              fontSize="11"
              fill="var(--color-sub-text)"
            >
              {v}
              {unit}
            </text>
          </g>
        ))}

        <polygon points={areaPoints} fill="rgba(220, 38, 38, 0.12)" />
        <polyline
          points={linePoints}
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.5"
        />

        {series.map((p, i) => (
          <circle
            key={p.label}
            cx={xFor(i)}
            cy={yFor(p.value)}
            r={p.highlight ? 6 : 3}
            fill="#dc2626"
          />
        ))}

        {series.map((p, i) => (
          <text
            key={p.label}
            x={xFor(i)}
            y={height - padding.bottom + 18}
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-sub-text)"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </section>
  );
}
