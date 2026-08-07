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
  useOffersByCarId,
} from "../../hooks/queries/useBattery";
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
  const {
    data: offersData,
    isFetching: isOffersFetching,
    isError: isOffersError,
  } = useOffersByCarId(diagnosedCarId);

  const handleDiagnose = () => {
    if (!selectedCarId) return;
    setDiagnosedCarId(selectedCarId);
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

          {diagnosedCarId && isOffersFetching && (
            <div className="placeholder-card">불러오는 중...</div>
          )}

          {diagnosedCarId && !isOffersFetching && (isOffersError || !offersData) && (
            <div className="placeholder-card">
              잔존가치·판매처 정보를 불러오지 못했습니다. 다시 시도해주세요.
            </div>
          )}

          {diagnosedCarId && !isOffersFetching && offersData && (
            <>
              <div className="stat-card-row">
                <BatteryStatCard
                  label="판별 등급"
                  value={offersData.summary.grade}
                  showDot
                  sub={offersData.summary.gradeSub}
                />
                <BatteryStatCard
                  label="예측 잔여수명"
                  value={offersData.summary.remainingCycle ?? 0}
                  unit="사이클"
                  sub={offersData.summary.remainingCycleSub}
                />
                <BatteryStatCard
                  label="최고 제안가"
                  value={offersData.summary.bestOffer}
                  unit="만원"
                  sub={offersData.summary.bestOfferSub}
                />
              </div>

              <div className="buyer-section-title">
                매입처별 예상 제안가 (
                {(offersData.topBuyers?.length || 0) +
                  (offersData.otherBuyers?.length || 0)}
                곳)
              </div>
              <div className="buyer-section-subtitle">상위 3곳은 상세 표시</div>

              {offersData.topBuyers.map((buyer) => (
                <BuyerCard key={buyer.name} {...buyer} />
              ))}

              {offersData.otherBuyers.length > 0 && (
                <>
                  <div className="buyer-others-label">그 외</div>
                  <BuyerTable rows={offersData.otherBuyers} />
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
              <ProposalContent diagnosisData={diagnosisData} proposalData={proposalData} />
            )}
        </>
      )}
    </div>
  );
}