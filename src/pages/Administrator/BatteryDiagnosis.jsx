import React, { useState } from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from "recharts";
import DiagnosisTabs from "../../components/administrator/battery/DiagnosisTabs";
import ReuseJudgementCard from "../../components/administrator/battery/ReuseJudgementCard";
import BatteryStatCard from "../../components/administrator/battery/BatteryStatCard";
import BuyerCard from "../../components/administrator/battery/BuyerCard";
import BuyerTable from "../../components/administrator/battery/BuyerTable";
import ProposalContent from "../../components/administrator/battery/ProposalContent";
import { diagnosisMock } from "../../mocks/diagnosisMock";
import { valueMock } from "../../mocks/valueMock";
import "../../styles/administrator/BatteryDiagnosis.css";

export default function BatteryDiagnosis() {
  const [activeTab, setActiveTab] = useState("diagnosis");
  const data = diagnosisMock; // 추후: const { data } = useBatteryDiagnosis(batteryId);
  const value = valueMock;
 
  return (
    <div className="battery-diagnosis-page">
      <h1 className="battery-diagnosis-title">배터리 진단</h1>
 
      <DiagnosisTabs activeTab={activeTab} onChange={setActiveTab} />
 
      {activeTab === "diagnosis" && (
        <>
          <div className="stat-card-row">
            <BatteryStatCard label="판별 등급" value={data.grade} showDot />
            <BatteryStatCard
              label="예측 잔여수명"
              value={data.remainingCycle ?? 0}
              unit="사이클"
              sub={data.newCycle ? `(신품 ${data.newCycle.toLocaleString()})` : null}
            />
            <BatteryStatCard
              label="배터리 건강도"
              value={data.healthScore}
              suffix="%"
              sub="(추정)"
            />
          </div>
 
          <ReuseJudgementCard
            judgement={data.judgement}
            distribution={data.distribution}
          />
        </>
      )}
 
      {activeTab === "value" && (
        <>
          <div className="stat-card-row">
            <BatteryStatCard
              label="판별 등급"
              value={value.summary.grade}
              showDot
              sub={value.summary.gradeSub}
            />
            <BatteryStatCard
              label="예측 잔여수명"
              value={value.summary.remainingCycle ?? 0}
              unit="사이클"
              sub={value.summary.remainingCycleSub}
            />
            <BatteryStatCard
              label="최고 제안가"
              value={value.summary.bestOffer}
              unit="만원"
              sub={value.summary.bestOfferSub}
            />
          </div>
 
          <div className="buyer-section-title">
            매입처별 예상 제안가 (
            {(value.topBuyers?.length || 0) + (value.otherBuyers?.length || 0)}곳)
          </div>
          <div className="buyer-section-subtitle">상위 3곳은 상세 표시</div>
 
          {value.topBuyers.map((buyer) => (
            <BuyerCard key={buyer.name} {...buyer} />
          ))}
 
          <div className="buyer-others-label">그 외</div>
          <BuyerTable rows={value.otherBuyers} />
        </>
      )}
 
      {activeTab === "proposal" && <ProposalContent diagnosisData={data} />}
    </div>
  );
}