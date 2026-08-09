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
//
// ⚠️ "『사용후배터리 산업 육성법』(2025.10 시행)"은 사실과 달랐다(웹서치로 재검증, pdf_report.py
// 참고) - 이 법(사용후 배터리의 관리 및 산업육성에 관한 법률)은 2026.5.26 공포, 2027.5.27
// 시행 "예정"이라 아직 시행 전이다. 지금 실제로 적용되는 근거는 자원순환기본법상 순환자원
// 지정 고시이고, 수출 시엔 별도로 폐기물 국가간이동법(바젤협약 국내이행법)이 적용된다.
// 건전성 세부 지표 4개가 실제로 무엇을 측정하는지 - rul-diagnosis/fastapi_app.py의
// compute_indicators()가 만드는 값 그대로 옮긴 것(지어낸 설명 아님):
//   life     = RUL 예측 사이클 / 신품 수명(full_life) 정규화
//   capacity = 완전 방전까지 걸리는 시간(discharge_time_s)을 동일 배터리군 백분위(p5~p95)로 정규화
//   charge   = 정전류(CC) 충전 구간 비율(cc_ratio) 정규화 - 열화될수록 CC 구간이 짧아짐
//   stability= 방전 중 3.6V→3.4V 도달 시간(decrement_36_34v_s) 정규화 - 느릴수록(값이 클수록) 안정적
const METRIC_METHODOLOGY = {
  "수명 여유": "AI 예측 잔여수명(RUL)을 신품 수명 대비 비율로 정규화한 값. 높을수록 구동 여유 큼",
  "방전 지속력":
    "완전 방전 소요시간(discharge_time_s)을 동일 배터리군 백분위(p5~p95)로 정규화한 값. 높을수록 1회 충전 구동시간 김",
  "충전 건전성":
    "정전류(CC) 충전 구간 비율(cc_ratio) 정규화 값. 열화될수록 CC 구간 짧아짐, 높을수록 신품 특성에 가까움",
  "전압 안정성": "방전 중 3.6V에서 3.4V까지 도달 시간 정규화 값. 높을수록(강하 속도 느릴수록) 전압 안정적",
};

const STANDARD_CAUTIONS = [
  "본 제안가는 공개 실거래·시장 벤치마크와 AI 진단 결과를 결합해 산정한 추정치, 귀사 제시 견적 아님",
  "최종 가격은 실물 검사(외관·전기적 검사) 및 시황에 따라 조정 가능",
  "전기차 사용후 배터리: 「자원순환기본법」 순환자원 지정 고시 대상, 폐기물관리법 규제 면제. " +
    "단, 일반적·품목별 준수사항 충족 필요(미충족 시 폐기물처리업 허가 대상 가능)",
  "「사용후 배터리의 관리 및 산업육성에 관한 법률」: 2026.5.26 공포, 2027.5.27 시행 예정(아직 " +
    "시행 전). 시행 후 탈거 전 성능평가·등급분류 및 이력·거래시스템 등록 의무화 예정, 사전 대비 필요",
  "해외 매입처 매각(수출) 시 「폐기물의 국가 간 이동 및 그 처리에 관한 법률」(바젤협약 국내 " +
    "이행법)에 따른 사전통보·승인 절차 별도 이행 필요",
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
  // 문체: 정부 보도자료식 개조식(명사형 종결, "—" 연결 금지, 짧은 문장) - PDF의 pdf_report.py
  // _to_gaejosik()가 최종 방어선으로 한 번 더 다듬지만, 소스 단계에서부터 이 스타일로 쓴다.
  const reasons = [
    ...p.reasons,
    "AI 진단 로직: Agent1(안전 게이트), Agent2(등급분류), Agent3(가치평가) 3단계 파이프라인 순차 적용",
    "RandomForest 회귀·분류 모델 사용. 잔여수명 예측 오차 ±11사이클, 등급 판별 정확도 98.4%",
    `판별 등급 ${diagnosisData.grade}(${diagnosisData.gradeLevel ?? "등급 미판정"}) AI 자동 분류` +
      (topBuyer ? `, ${topBuyer.name}(${topBuyer.gradeLabel}) 매입 조건 충족` : ""),
    `배터리 건강도(SOH) ${diagnosisData.healthScore}%, 예측 잔여수명 ` +
      `${diagnosisData.remainingCycle?.toLocaleString?.() ?? diagnosisData.remainingCycle}사이클` +
      `(신품 기준 ${diagnosisData.newCycle?.toLocaleString?.() ?? diagnosisData.newCycle}사이클 대비 ` +
      `${diagnosisData.newCycle ? Math.round((diagnosisData.remainingCycle / diagnosisData.newCycle) * 100) : "—"}%) 확인`,
    `공칭 용량 ${diagnosisData.capacityKwh ?? "—"}kWh` +
      (topBuyer ? `, ${topBuyer.name} 취급 규모 부합` : ""),
    ...(diagnosisData.judgement?.confidence
      ? [`AI 판정 신뢰도(분류 모델 출력값) ${diagnosisData.judgement.confidence}%, 등급 판정 신뢰성 높음`]
      : []),
    // 건전성 세부 지표 4개 - rul-diagnosis의 compute_indicators()가 실제로 어떤 원본
    // 센서값을 어떻게 정규화해 이 점수를 만드는지(fastapi_app.py 기준) 지표별로 풀어써서
    // 숫자의 근거가 드러나게 한다.
    ...(p.healthMetrics ?? []).map((m) => {
      const detail = METRIC_METHODOLOGY[m.label];
      return detail ? `${m.label} ${m.score}: ${detail}` : `${m.label} ${m.score} 측정`;
    }),
    ...(topBuyer?.description
      ? [`확인된 사업 영역: ${topBuyer.name}(${topBuyer.category}), ${topBuyer.description}`]
      : []),
    ...(topBuyer?.tag ? [`확인된 근거: ${topBuyer.tag}`] : []),
    `제안 단가 ${p.price.unitPrice}원/kWh, 공개 시장 벤치마크` +
      `(${priceSourceLabel || "BloombergNEF 등 국제 배터리팩 가격조사"})와 AI 진단 결과 결합 산정`,
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
            가격 산정 참고자료: {priceSourceLabel || "관련 자료"} ↗
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
            매입처 근거 참고자료 ↗
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