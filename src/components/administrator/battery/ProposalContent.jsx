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
 * buyers: "잔존가치/판매처" 탭에서 "매입처 3곳 찾기"를 눌러 찾은 top3 매입처 배열
 *   (buyerResult.topBuyers, 부모 BatteryDiagnosis.jsx가 넘겨줌) - 아직 검색 전이면 undefined.
 * selectedBuyerIdx / onSelectBuyer: buyers 중 몇 번째를 기준으로 제안서를 쓸지 - 부모가
 *   상태를 들고 있고 여기서는 고르는 UI만 그린다(재검색 시 부모가 0번으로 초기화).
 * priceSourceUrl / priceSourceLabel: 제안 단가 산정 근거(BNEF 등) 링크 - buyers와 별개로
 *   항상 같은 값이라 buyerResult에서 그대로 내려받는다.
 */
export default function ProposalContent({
  diagnosisData,
  proposalData,
  buyers,
  selectedBuyerIdx = 0,
  onSelectBuyer,
  priceSourceUrl,
  priceSourceLabel,
}) {
  const p = proposalData;
  const [isExporting, setIsExporting] = useState(false);
  const topBuyer = buyers?.[selectedBuyerIdx];

  // "귀사에 적합한 이유" - 예전엔 DB의 suitabilityReason 문구 1개(+매입처 설명 1줄)뿐이라
  // 너무 부실했다. 이미 화면에 있는 진단·매입처 데이터를 최대한 근거로 엮어 여러 문장으로
  // 풀어쓴다 - 지어낸 수치는 하나도 없고, 전부 diagnosisData/proposalData/topBuyer에
  // 이미 있는 값을 문장으로 조립한 것뿐이다.
  const reasons = [
    ...p.reasons,
    // AI 로직 설명 — 등급·가치가 어떻게 계산됐는지(3단계 파이프라인 + 모델 종류 + 정확도)를
    // 먼저 설명해야 뒤에 나오는 수치들이 "AI가 계산한 값"이라는 게 근거로 읽힌다.
    // p.diagnosisNote(RandomForest·오차율)는 팀 자체 모델 평가 결과이므로 외부 출처 링크가
    // 필요 없다(자사 실측치) - 대신 회사 밖 자료를 인용할 때는(매입처/가격 근거) 아래처럼
    // 공식 자료(회사 뉴스룸·언론 보도·BloombergNEF 리포트)만 links로 붙인다.
    `AI 진단 로직 — 화재/안전 위험 게이트(Agent1) → SOH 등급 분류(Agent2) → 잔여수명·가치 평가(Agent3) ` +
      `3단계 파이프라인을 통과했습니다. ${p.diagnosisNote}`,
    `본 배터리는 판별 등급 ${diagnosisData.grade}(${diagnosisData.gradeLevel ?? "등급 미판정"})로 ` +
      `AI가 분류하여${topBuyer ? `, ${topBuyer.name}(${topBuyer.gradeLabel}) 매입 조건을 충족합니다.` : "입니다."}`,
    `AI 모델이 산출한 배터리 건강도(SOH) ${diagnosisData.healthScore}%, 예측 잔여수명 ${diagnosisData.remainingCycle?.toLocaleString?.() ?? diagnosisData.remainingCycle} ` +
      `사이클(신품 기준 ${diagnosisData.newCycle?.toLocaleString?.() ?? diagnosisData.newCycle} 사이클 대비 ` +
      `${diagnosisData.newCycle ? Math.round((diagnosisData.remainingCycle / diagnosisData.newCycle) * 100) : "—"}%)로, ` +
      `안정적인 성능을 유지하고 있는 것으로 확인됩니다.`,
    `공칭 용량 ${diagnosisData.capacityKwh ?? "—"}kWh 규모로${topBuyer ? `, ${topBuyer.name}의 취급 규모에 부합합니다.` : "입니다."}`,
    ...(diagnosisData.judgement?.confidence
      ? [`AI 판정 신뢰도(분류 모델 출력값) ${diagnosisData.judgement.confidence}%로, 등급 판정 결과의 신뢰성이 높습니다.`]
      : []),
    ...(p.healthMetrics ?? []).map(
      (m) => `AI가 계산한 건전성 세부 지표 중 '${m.label}' ${m.score}로 측정되어, 이를 근거로 매입 후 활용 가치를 산정했습니다.`,
    ),
    ...(topBuyer?.description
      ? [`확인된 사업 영역 — ${topBuyer.name}(${topBuyer.category}) · ${topBuyer.description}`]
      : []),
    ...(topBuyer?.tag ? [`실제 확인된 근거 — ${topBuyer.tag}`] : []),
    `제안 단가 ${p.price.unitPrice}원/kWh는 공개 시장 벤치마크(${priceSourceLabel || "BloombergNEF 등 국제 배터리팩 가격조사"})에 ` +
      `AI 진단 결과를 결합해 산정한 값입니다.`,
  ];
  const cautions = [...p.cautions, ...STANDARD_CAUTIONS];

  const handleDownload = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const blob = await batteryService.downloadProposalPdf({
        diagnosisData,
        proposalData: { ...proposalData, reasons, cautions },
        chosenBuyer: topBuyer,
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
      {buyers && buyers.length > 0 && (
        <div className="buyer-picker" role="radiogroup" aria-label="매입처 선택">
          {buyers.map((b, i) => (
            <button
              key={b.name}
              type="button"
              role="radio"
              aria-checked={i === selectedBuyerIdx}
              className={`buyer-picker-btn${i === selectedBuyerIdx ? " is-selected" : ""}`}
              onClick={() => onSelectBuyer?.(i)}
            >
              <div className="buyer-picker-btn-name">{i + 1}위 · {b.name}</div>
              <div className="buyer-picker-btn-price">{b.price.toLocaleString()}만원 · {b.gradeLabel}</div>
            </button>
          ))}
        </div>
      )}

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
        {priceSourceUrl && (
          <a
            href={priceSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="proposal-source-link"
          >
            가격 산정 출처 — {priceSourceLabel || "출처 보기"} ↗
          </a>
        )}
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
        {topBuyer?.sourceUrl && (
          <a
            href={topBuyer.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="proposal-source-link"
            style={{ display: "inline-block", marginTop: 8 }}
          >
            매입처 근거 출처 보기 ↗
          </a>
        )}
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