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
      <section className="border-t border-[var(--color-border)] py-6">
        <h3 className="mb-2 text-lg font-bold text-[var(--color-header-text)]">
          {heading}
        </h3>
        <p className="text-sm text-[var(--color-btn-desc)]">
          표시할 차트 데이터가 없습니다.
        </p>
      </section>
    );
  }

  const width = 700;
  const height = 260;
  const padding = { top: 10, right: 16, bottom: 30, left: 40 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const values = series.map((point) => point.value);
  const { lower, upper, step } = niceBounds(values);
  const xFor = (index) =>
    padding.left + (innerW * index) / Math.max(series.length - 1, 1);
  const yFor = (value) =>
    padding.top + innerH - ((value - lower) / (upper - lower)) * innerH;
  const linePoints = series
    .map((point, index) => `${xFor(index)},${yFor(point.value)}`)
    .join(" ");
  const areaPoints = `${xFor(0)},${yFor(lower)} ${linePoints} ${xFor(series.length - 1)},${yFor(lower)}`;
  const gridLines = [];
  for (let value = lower; value <= upper; value += step) {
    gridLines.push(value);
  }

  return (
    <section className="border-t border-[var(--color-border)] py-6">
      <h3 className="mb-4 text-lg font-bold text-[var(--color-header-text)]">
        {heading}
      </h3>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white p-3 shadow-[0_3px_10px_rgba(15,61,46,0.07)]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[620px]"
          role="img"
          aria-label={heading}
        >
          {gridLines.map((value) => (
            <g key={value}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={yFor(value)}
                y2={yFor(value)}
                stroke="var(--color-border)"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={yFor(value) + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--color-sub-text)"
              >
                {value}
                {unit}
              </text>
            </g>
          ))}

          <polygon points={areaPoints} fill="rgba(220, 38, 38, 0.1)" />
          <polyline
            points={linePoints}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {series.map((point, index) => (
            <circle
              key={`point-${point.label}-${index}`}
              cx={xFor(index)}
              cy={yFor(point.value)}
              r={point.highlight ? 6 : 3}
              fill="#ef4444"
            />
          ))}

          {series.map((point, index) => (
            <text
              key={`label-${point.label}-${index}`}
              x={xFor(index)}
              y={height - padding.bottom + 18}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-sub-text)"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}
