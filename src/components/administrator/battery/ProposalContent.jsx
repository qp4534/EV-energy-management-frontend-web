import React from "react";
import StatusDot from "../common/StatusDot";
import InfoBlock from "./InfoBlock";
import ProposalSection from "./ProposalSection";
import BuyerTable from "./BuyerTable";
import BulletList from "../common/BulletList";
import PdfDownloadButton from "./PdfDownloadBtn";
import { proposalMock } from "../../../mocks/proposalMock";

/**
 * diagnosisData: diagnosisMock (BatteryDiagnosisPage에서 이미 갖고 있는 grade/remainingCycle/newCycle/healthScore)
 * 섹션 2는 진단 탭이랑 같은 데이터라 별도 mock 없이 그대로
 */
export default function ProposalContent({ diagnosisData }) {
  const p = proposalMock;

  return (
    <>
      <ProposalSection title="1. 제안 가격">
        <div className="info-block-row">
          <InfoBlock label="제안 총액" value={p.price.total.toLocaleString()} unit="만원" />
          <InfoBlock label="제안 단가" value={p.price.unitPrice} unit="원/kWh" />
          <InfoBlock label="협의 범위 · 용량" value={p.price.negotiationRange} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <StatusDot tone="success" label={p.price.grade} size="sm" />
        </div>
        <p className="proposal-note">{p.price.note}</p>
      </ProposalSection>

      <ProposalSection title="2. 배터리 상태 진단 (AI 진단 결과)">
        <div className="info-block-row">
          <InfoBlock
            label="판별 등급"
            value={
              <StatusDot tone="success" label={diagnosisData.grade} size="sm" />
            }
          />
          <InfoBlock
            label="예측 잔여수명"
            value={diagnosisData.remainingCycle.toLocaleString()}
            unit="사이클"
            caption={`(신품 ${diagnosisData.newCycle.toLocaleString()})`}
          />
          <InfoBlock
            label="배터리 건강도"
            value={`${diagnosisData.healthScore}%`}
            caption="(추정)"
          />
        </div>

        <BuyerTable
          title="건전성 세부 지표 (1~100)"
          columns={[
            { key: "label", label: "지표" },
            { key: "score", label: "점수", align: "right" },
          ]}
          rows={p.healthMetrics}
        />

        <p className="proposal-note" style={{ marginTop: 12 }}>
          {p.diagnosisNote}
        </p>
      </ProposalSection>

      <ProposalSection title="3. 귀사에 적합한 이유">
        <BulletList items={p.reasons} />
      </ProposalSection>

      <ProposalSection title="4. 유의사항">
        <BulletList items={p.cautions} />
      </ProposalSection>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <PdfDownloadButton onClick={() => console.log("PDF 다운로드")} />
      </div>
    </>
  );
}