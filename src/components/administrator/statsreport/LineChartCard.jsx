import CardShell from "../common/CardShell";
import LineTrendChart from "../common/LineTrendChart";

export default function LineChartCard({
  title,
  data,
  dataKey,
  xKey,
  color,
  unit,
  expandTo,
}) {
  return (
    <CardShell title={title} expandTo={expandTo}>
      <LineTrendChart data={data} dataKey={dataKey} xKey={xKey} color={color} unit={unit} />
    </CardShell>
  );
}
