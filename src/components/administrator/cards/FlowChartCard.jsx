import CardShell from "../CardShell";
import FlowChart from "../FlowChart";

export default function FlowChartCard({
  title,
  data,
  seriesA,
  seriesB,
  colorA,
  colorB,
}) {
  return (
    <CardShell title={title}>
      <FlowChart
        data={data}
        seriesA={seriesA}
        seriesB={seriesB}
        colorA={colorA}
        colorB={colorB}
      />
    </CardShell>
  );
}