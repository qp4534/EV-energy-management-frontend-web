import React, { useState } from "react";
import StatusDot from "../common/StatusDot";
import InfoBlock from "./InfoBlock";
import ProposalSection from "./ProposalSection";
import BuyerTable from "./BuyerTable";
import BulletList from "../common/BulletList";
import PdfDownloadButton from "./PdfDownloadBtn";
import { batteryService } from "../../../services/batteryService";

// 모든 제안서에 공통으로 붙는 법적/일반 유의사항 - 예전 rul_diagnosis의 build_pdf()가
// 항상 보여주던 문구인데, DB의 BATTERY_PROPOSALS.notice_text는 건별 문구 1개만 담고 있어서
// 그것만 쓰면 정보가 부실해 보였다. 화면과 PDF가 항상 같은 내용을 보여줘야 하므로(둘 다
// 이 배열을 그대로 씀) 여기 한 곳에서만 관리한다.
const STANDARD_CAUTIONS = [
  "본 제안가는 공개 실거래·시장 벤치마크에 AI 진단 결과를 결합하여 산정한 추정치이며, 귀사가 제시한 견적이 아닙니다.",
  "최종 가격은 실물 검사(외관·전기적 검사) 및 시황에 따라 조정될 수 있습니다.",
  "『사용후배터리 산업 육성법』(2025.10 시행)에 따라 사용후 배터리는 지정된 회수·재활용 경로로만 반납해야 하며, 매각 전 적법 경로 여부를 확인하여야 합니다.",
];

/**
 * diagnosisData: "배터리 진단" 탭과 같은 carId로 조회한 실제 진단 데이터
 *   (grade/remainingCycle/newCycle/healthScore) - 섹션 2는 진단 탭이랑 같은 데이터라 그대로 재사용
 * proposalData: batteryService.getProposalByCarId() 결과 (price/healthMetrics/reasons/cautions)
 *   과거엔 이 값이 proposalMock 고정값이라 차량을 바꿔도 내용이 안 바뀌었다 - 이제 부모가
 *   선택된 차량 기준으로 조회한 실제 데이터를 넘겨준다.
 * topBuyer: "잔존가치/판매처" 탭에서 "매입처 3곳 찾기"를 눌러 찾은 결과의 최고 매입처 1곳
 *   (buyerResult.topBuyers[0], 부모 BatteryDiagnosis.jsx가 넘겨줌). "귀사에 적합한 이유"가
 *   DB엔 문구 1개뿐이라 부실해서, 실시간 검색으로 확인된 매입처의 사업 영역 설명을
 *   추가로 붙여 보강한다 - 아직 검색 전이면 undefined라 이 보강 없이 기본 문구만 나간다.
 */
export default function ProposalContent({ diagnosisData, proposalData, topBuyer }) {
  const p = proposalData;
  const [isExporting, setIsExporting] = useState(false);

  const reasons = [
    ...p.reasons,
    ...(topBuyer?.description
      ? [`확인된 사업 영역 — ${topBuyer.name} · ${topBuyer.description}`]
      : []),
  ];
  const cautions = [...p.cautions, ...STANDARD_CAUTIONS];

  const handleDownload = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const blob = await batteryService.downloadProposalPdf({
        diagnosisData,
        proposalData: { ...proposalData, reasons, cautions },
      });
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
        <BulletList items={reasons} />
      </ProposalSection>

      <ProposalSection title="4. 유의사항">
        <BulletList items={cautions} />
      </ProposalSection>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <PdfDownloadButton onClick={handleDownload} disabled={isExporting} />
      </div>
    </>
  );
}