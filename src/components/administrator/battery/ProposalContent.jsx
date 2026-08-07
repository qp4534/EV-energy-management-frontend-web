import React, { useState } from "react";
import StatusDot from "../common/StatusDot";
import InfoBlock from "./InfoBlock";
import ProposalSection from "./ProposalSection";
import BuyerTable from "./BuyerTable";
import BulletList from "../common/BulletList";
import PdfDownloadButton from "./PdfDownloadBtn";
import { batteryService } from "../../../services/batteryService";

/**
 * diagnosisData: "배터리 진단" 탭과 같은 carId로 조회한 실제 진단 데이터
 *   (grade/remainingCycle/newCycle/healthScore) - 섹션 2는 진단 탭이랑 같은 데이터라 그대로 재사용
 * proposalData: batteryService.getProposalByCarId() 결과 (price/healthMetrics/reasons/cautions)
 *   과거엔 이 값이 proposalMock 고정값이라 차량을 바꿔도 내용이 안 바뀌었다 - 이제 부모가
 *   선택된 차량 기준으로 조회한 실제 데이터를 넘겨준다.
 */
export default function ProposalContent({ diagnosisData, proposalData }) {
  const p = proposalData;
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const blob = await batteryService.downloadProposalPdf({ diagnosisData, proposalData });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "배터리_매도_제안서.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF 다운로드 실패", e);
      alert("PDF 다운로드에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsExporting(false);
    }
  };

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
        <PdfDownloadButton onClick={handleDownload} disabled={isExporting} />
      </div>
    </>
  );
}