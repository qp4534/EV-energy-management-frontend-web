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
import TabBar from "../../components/administrator/common/TabBar";
import ReuseJudgementCard from "../../components/administrator/battery/ReuseJudgementCard";
import BatteryStatCard from "../../components/administrator/battery/BatteryStatCard";
import BuyerCard from "../../components/administrator/battery/BuyerCard";
import BuyerTable from "../../components/administrator/battery/BuyerTable";
import ProposalContent from "../../components/administrator/battery/ProposalContent";
import { useCarOptions } from "../../hooks/queries/useCar";
import {
  useBatteryDiagnosisByCarId,
  useProposalByCarId,
} from "../../hooks/queries/useBattery";
import { batteryService } from "../../services/batteryService";
import "../../styles/administrator/BatteryDiagnosis.css";

const DIAGNOSIS_TABS = [
  { key: "diagnosis", label: "배터리 진단" },
  { key: "value", label: "배터리 잔존가치/판매처" },
  { key: "proposal", label: "배터리 매도 제안서" },
];

export default function BatteryDiagnosis() {
  const [activeTab, setActiveTab] = useState("diagnosis");

  // "배터리 진단" 탭 - 차량을 선택하고 "진단 실행"을 눌러야 실제 조회가 실행된다.
  // "배터리 매도 제안서"·"배터리 잔존가치/판매처" 탭도 같은 diagnosedCarId를 그대로 써서,
  // 여기서 고른 차량이 바뀌면 두 탭 모두 같이 바뀐다(예전엔 둘 다 mock 고정값이라
  // 차량을 바꿔도 내용이 그대로였음 - 이제 실제 API로 연결).
  const [selectedCarId, setSelectedCarId] = useState("");
  const [diagnosedCarId, setDiagnosedCarId] = useState(null);
  const { data: carOptions = [] } = useCarOptions();
  const {
    data: diagnosisData,
    isFetching: isDiagnosing,
    isError: isDiagnosisError,
  } = useBatteryDiagnosisByCarId(diagnosedCarId);
  const {
    data: proposalData,
    isFetching: isProposalFetching,
    isError: isProposalError,
  } = useProposalByCarId(diagnosedCarId);

  // "잔존가치/판매처" 탭 - 잔존가치(등급/사이클/건강도)는 diagnosisData만 있으면 바로
  // 뜨고, 매입처 매칭(rul-diagnosis 왕복이 필요해 상대적으로 느림)은 버튼을 눌러야
  // 돌아간다. 이때 찾은 결과는 "매도 제안서" 탭에도 그대로 넘어가서(topBuyer) 그
  // 탭의 "귀사에 적합한 이유"도 같이 근거 있는 내용으로 채워진다.
  const [buyerResult, setBuyerResult] = useState(null);
  const [isSearchingBuyers, setIsSearchingBuyers] = useState(false);
  const [buyerSearchError, setBuyerSearchError] = useState(false);
  const [buyerSearchMissingData, setBuyerSearchMissingData] = useState(false);
  // "매도 제안서" 탭에서 top3 매입처 중 어느 곳을 기준으로 제안서를 쓸지 - buyerResult가
  // 새로 갱신될 때마다(재검색·재진단) 0번(최고 제안가)으로 되돌린다.
  const [selectedBuyerIdx, setSelectedBuyerIdx] = useState(0);

  const handleDiagnose = () => {
    if (!selectedCarId) return;
    setDiagnosedCarId(selectedCarId);
    setBuyerResult(null);
    setBuyerSearchError(false);
    setBuyerSearchMissingData(false);
    setSelectedBuyerIdx(0);
  };

  const handleFindBuyers = async () => {
    if (isSearchingBuyers) return;
    // 예전엔 여기서 gradeLevel/capacityKwh가 없으면 아무 반응 없이 조용히 return해서,
    // 데이터가 부실한 차량에서는 버튼을 눌러도 눌리는 게 안 보였다(실제로는 눌렸지만
    // 아무 일도 안 일어난 것) - 이제는 왜 안 되는지 화면에 이유를 보여준다.
    if (!diagnosisData?.gradeLevel || !diagnosisData?.capacityKwh) {
      setBuyerSearchMissingData(true);
      return;
    }
    setIsSearchingBuyers(true);
    setBuyerSearchError(false);
    setBuyerSearchMissingData(false);
    try {
      const result = await batteryService.fetchLiveOffers({
        grade: diagnosisData.gradeLevel,
        capacityKwh: diagnosisData.capacityKwh,
        condition: diagnosisData.healthScore / 100,
      });
      setBuyerResult(result);
      setSelectedBuyerIdx(0);
    } catch (e) {
      console.error("매입처 조회 실패", e);
      setBuyerSearchError(true);
    } finally {
      setIsSearchingBuyers(false);
    }
  };

  return (
    <div className="battery-diagnosis-page">
      <h2 className="battery-diagnosis-title">배터리 진단</h2>

      <TabBar tabs={DIAGNOSIS_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "diagnosis" && (
        <>
          <div className="battery-diagnosis-selector">
            <select
              className="battery-diagnosis-select"
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(e.target.value)}
            >
              <option value="">차량 선택</option>
              {carOptions.map((car) => (
                <option key={car.carId} value={car.carId}>
                  {car.carNumber}
                  {car.model ? ` (${car.model})` : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="battery-diagnosis-run-btn"
              onClick={handleDiagnose}
              disabled={!selectedCarId || isDiagnosing}
            >
              {isDiagnosing ? "진단 중..." : "진단 실행"}
            </button>
          </div>

          {!diagnosedCarId && (
            <div className="placeholder-card">
              차량을 선택하고 "진단 실행"을 눌러주세요.
            </div>
          )}

          {diagnosedCarId && isDiagnosisError && (
            <div className="placeholder-card">
              진단 정보를 불러오지 못했습니다. 다시 시도해주세요.
            </div>
          )}

          {diagnosedCarId && !isDiagnosing && !isDiagnosisError && !diagnosisData && (
            <div className="placeholder-card">
              해당 차량의 배터리 진단 데이터가 없습니다.
            </div>
          )}

          {diagnosedCarId && !isDiagnosisError && diagnosisData && (
            <>
              <div className="stat-card-row">
                <BatteryStatCard label="판별 등급" value={diagnosisData.grade} showDot />
                <BatteryStatCard
                  label="예측 잔여수명"
                  value={diagnosisData.remainingCycle ?? 0}
                  unit="사이클"
                  sub={
                    diagnosisData.newCycle
                      ? `(신품 ${diagnosisData.newCycle.toLocaleString()})`
                      : null
                  }
                />
                <BatteryStatCard
                  label="배터리 건강도"
                  value={diagnosisData.healthScore}
                  suffix="%"
                  sub="(추정)"
                />
              </div>

              <ReuseJudgementCard
                judgement={diagnosisData.judgement}
                distribution={diagnosisData.distribution}
              />
            </>
          )}
        </>
      )}
 
      {activeTab === "value" && (
        <>
          {!diagnosedCarId && (
            <div className="placeholder-card">
              "배터리 진단" 탭에서 차량을 선택하고 "진단 실행"을 누르면
              그 차량의 잔존가치·판매처가 표시됩니다.
            </div>
          )}

          {diagnosedCarId && isDiagnosing && (
            <div className="placeholder-card">불러오는 중...</div>
          )}

          {diagnosedCarId && !isDiagnosing && (isDiagnosisError || !diagnosisData) && (
            <div className="placeholder-card">
              잔존가치 정보를 불러오지 못했습니다. 다시 시도해주세요.
            </div>
          )}

          {/* 잔존가치(등급/사이클/건강도)는 진단 데이터만 있으면 바로 뜬다 - 매입처
              검색(rul-diagnosis 왕복)을 기다릴 필요가 없다. */}
          {diagnosedCarId && !isDiagnosing && diagnosisData && (
            <>
              <div className="stat-card-row">
                <BatteryStatCard label="판별 등급" value={diagnosisData.grade} showDot />
                <BatteryStatCard
                  label="예측 잔여수명"
                  value={diagnosisData.remainingCycle ?? 0}
                  unit="사이클"
                  sub={
                    diagnosisData.newCycle
                      ? `(신품 ${diagnosisData.newCycle.toLocaleString()})`
                      : null
                  }
                />
                <BatteryStatCard
                  label="배터리 건강도"
                  value={diagnosisData.healthScore}
                  suffix="%"
                  sub="(추정)"
                />
              </div>

              <div className="buyer-section-title">매입처별 예상 제안가</div>
              {buyerResult?.priceSourceUrl && (
                <a
                  href={buyerResult.priceSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="buyer-price-source-link"
                >
                  가격 산정 출처 — {buyerResult.priceSourceLabel || "출처 보기"} ↗
                </a>
              )}

              {!buyerResult && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                  <button
                    type="button"
                    onClick={handleFindBuyers}
                    disabled={isSearchingBuyers}
                    className="battery-diagnosis-run-btn"
                  >
                    {isSearchingBuyers ? "매입처 찾는 중..." : "매입처 3곳 찾기"}
                  </button>
                  {buyerSearchError && (
                    <span style={{ fontSize: 12, color: "#c0392b" }}>
                      매입처 조회에 실패했어요. 다시 시도해주세요.
                    </span>
                  )}
                  {buyerSearchMissingData && (
                    <span style={{ fontSize: 12, color: "#c0392b" }}>
                      이 차량은 등급(1/2/3등급) 또는 배터리 용량 정보가 없어 매입처를 찾을 수 없어요.
                    </span>
                  )}
                </div>
              )}

              {buyerResult && (
                <>
                  <div className="buyer-section-subtitle">
                    {(buyerResult.topBuyers?.length || 0) + (buyerResult.otherBuyers?.length || 0)}
                    곳 · 상위 3곳은 상세 표시
                    {buyerResult.live ? " · 🔎 실시간 검색으로 찾은 매입처" : ""}
                  </div>

                  {buyerResult.topBuyers.map((buyer) => (
                    <BuyerCard key={buyer.name} {...buyer} />
                  ))}

                  {buyerResult.otherBuyers.length > 0 && (
                    <>
                      <div className="buyer-others-label">그 외</div>
                      <BuyerTable rows={buyerResult.otherBuyers} />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
 
      {activeTab === "proposal" && (
        <>
          {!diagnosedCarId && (
            <div className="placeholder-card">
              "배터리 진단" 탭에서 차량을 선택하고 "진단 실행"을 누르면
              그 차량의 매도 제안서가 표시됩니다.
            </div>
          )}

          {diagnosedCarId && (isDiagnosing || isProposalFetching) && (
            <div className="placeholder-card">제안서를 불러오는 중...</div>
          )}

          {diagnosedCarId &&
            !isDiagnosing &&
            !isProposalFetching &&
            (isDiagnosisError || isProposalError || !diagnosisData || !proposalData) && (
              <div className="placeholder-card">
                매도 제안서 정보를 불러오지 못했습니다. 다시 시도해주세요.
              </div>
            )}

          {diagnosedCarId &&
            !isDiagnosing &&
            !isProposalFetching &&
            diagnosisData &&
            proposalData && (
              <ProposalContent
                diagnosisData={diagnosisData}
                proposalData={proposalData}
                buyers={buyerResult?.topBuyers}
                selectedBuyerIdx={selectedBuyerIdx}
                onSelectBuyer={setSelectedBuyerIdx}
                priceSourceUrl={buyerResult?.priceSourceUrl}
                priceSourceLabel={buyerResult?.priceSourceLabel}
              />
            )}
        </>
      )}
    </div>
  );
}