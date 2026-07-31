import StatCard from '../main/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ReuseJudgementCard({ judgement = {}, distribution = [] }) {
  return (
    <div className="judgement-card">
      <div className="judgement-card-header">
        <div>
          <p className="judgement-label">재사용 판정</p>
          <div className="judgement-title">
            <span className="judgement-dot" />
            <span className="judgement-title-text">{judgement?.label || judgement?.status || judgement?.grade || "-"}</span>
          </div>
          <p className="judgement-desc">{judgement?.description || ""}</p>
        </div>
 
        <div className="judgement-confidence">
          <p className="judgement-label">판정 신뢰도</p>
          <span className="judgement-confidence-value">
            {(judgement?.confidence ?? 0).toFixed(1)} %
          </span>
        </div>
      </div>
 
      <div className="judgement-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-sub-text)", fontSize: 12 }}
            />
            <YAxis
              domain={[0, 1]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-btn-desc)", fontSize: 12 }}
            />
            <Bar
              dataKey="value"
              fill="var(--color-primary-btn)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}