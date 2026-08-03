import CardShell from "../common/CardShell";
import DonutStat from "../common/DonutStat";

/**
 * 단일 도넛 차트로 여러 항목의 분포를 보여주는 카드. (예: 유형별 분포 - 관리자/관제자/차주)
 */
export default function DonutCard({ title, centerLabel, data, expandTo }) {
  return (
    <CardShell title={title} expandTo={expandTo}>
      <DonutStat title={centerLabel} data={data} />
    </CardShell>
  );
}
