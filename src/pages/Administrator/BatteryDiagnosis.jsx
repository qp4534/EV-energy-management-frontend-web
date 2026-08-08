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
  const {
    data: offersData,
    isFetching: isOffersFetching,
    isError: isOffersError,
  } = useOffersByCarId(diagnosedCarId);

  // "잔존가치/판매처" 탭 - 매입처 카드들을 만들 때(=상위 매입처 목록을 화면에 그릴 때) 한
  // 번에 키를 넣고 실시간 검색을 돌린다. DB 고정 목록(offersData) 대신, 회사 자체를
  // 검색으로 찾아서(가격은 기존 계산식 그대로) liveOffers로 목록을 통째로 교체한다.
  // 키는 이 요청에만 쓰이고 저장·로그되지 않는다.
  const [showKeyFields, setShowKeyFields] = useState(false);
  const [serperApiKeyNh, setSerperApiKeyNh] = useState("");
  const [deepseekApiKeyNh, setDeepseekApiKeyNh] = useState("");
  const [isSearchingLiveOffers, setIsSearchingLiveOffers] = useState(false);
  const [liveOffers, setLiveOffers] = useState(null); // null = 아직 검색 안 함(기존 DB 목록 표시)
  const [liveOffersError, setLiveOffersError] = useState(false);

  const handleDiagnose = () => {
    if (!selectedCarId) return;
    setDiagnosedCarId(selectedCarId);
  };

  const handleSearchLiveOffers = async () => {
    if (isSearchingLiveOffers || !diagnosisData?.gradeLevel || !diagnosisData?.capacityKwh) return;
    setIsSearchingLiveOffers(true);
    setLiveOffersError(false);
    try {
      const result = await batteryService.fetchLiveOffers({
        grade: diagnosisData.gradeLevel,
        capacityKwh: diagnosisData.capacityKwh,
        condition: diagnosisData.healthScore / 100,
        serperApiKeyNh: serperApiKeyNh || undefined,
        deepseekApiKeyNh: deepseekApiKeyNh || undefined,
      });
      setLiveOffers(result);
    } catch (e) {
      console.error("매입처 실시간 검색 실패", e); // e에 키가 담기지 않음
      setLiveOffersError(true);
    } finally {
      setIsSearchingLiveOffers(false);
      setSerperApiKeyNh("");
      setDeepseekApiKeyNh("");
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setShowKeyFields((v) => !v)}
              style={{ background: "none", border: "none", padding: 0, fontSize: 12, color: "#888", cursor: "pointer" }}
            >
              {showKeyFields ? "실시간 검색 닫기" : "매입처를 실시간 검색으로 다시 찾기 (선택)"}
            </button>

            {showKeyFields && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <input
                  type="password"
                  autoComplete="off"
                  value={serperApiKeyNh}
                  onChange={(e) => setSerperApiKeyNh(e.target.value)}
                  placeholder="Serper API 키 (검색용)"
                  style={{ width: 260, padding: "6px 8px", fontSize: 13, border: "1px solid #ddd", borderRadius: 4 }}
                />
                <input
                  type="password"
                  autoComplete="off"
                  value={deepseekApiKeyNh}
                  onChange={(e) => setDeepseekApiKeyNh(e.target.value)}
                  placeholder="DeepSeek API 키 (요약용)"
                  style={{ width: 260, padding: "6px 8px", fontSize: 13, border: "1px solid #ddd", borderRadius: 4 }}
                />
                <span style={{ fontSize: 11, color: "#999" }}>
                  둘 다 입력 안 하면 서버 기본값 사용. 회사 자체를 실시간 검색으로 다시 찾고, 가격은 기존
                  계산식 그대로 적용해요. 키는 저장·기록되지 않아요.
                </span>
                <button
                  type="button"
                  onClick={handleSearchLiveOffers}
                  disabled={isSearchingLiveOffers || !diagnosedCarId}
                  className="battery-diagnosis-run-btn"
                >
                  {isSearchingLiveOffers ? "검색 중..." : "실시간 검색으로 매입처 다시 찾기"}
                </button>
                {liveOffersError && (
                  <span style={{ fontSize: 11, color: "#c0392b" }}>
                    검색에 실패했어요. 잠시 후 다시 시도해주세요.
                  </span>
                )}
              </div>
            )}
          </div>

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

              {(() => {
                const topBuyers = liveOffers ? liveOffers.topBuyers : offersData.topBuyers;
                const otherBuyers = liveOffers ? liveOffers.otherBuyers : offersData.otherBuyers;
                return (
                  <>
                    <div className="buyer-section-title">
                      매입처별 예상 제안가 (
                      {(topBuyers?.length || 0) + (otherBuyers?.length || 0)}
                      곳)
                    </div>
                    <div className="buyer-section-subtitle">
                      상위 3곳은 상세 표시
                      {liveOffers && (
                        <span style={{ marginLeft: 8 }}>
                          {liveOffers.live
                            ? "· 🔎 실시간 검색으로 찾은 매입처"
                            : "· 검색 결과가 없어 기존 매입처 목록으로 표시 중"}
                        </span>
                      )}
                    </div>

                    {topBuyers.map((buyer) => (
                      <BuyerCard key={buyer.name} {...buyer} />
                    ))}

                    {otherBuyers.length > 0 && (
                      <>
                        <div className="buyer-others-label">그 외</div>
                        <BuyerTable rows={otherBuyers} />
                      </>
                    )}
                  </>
                );
              })()}
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
                topBuyer={offersData?.topBuyers?.[0]}
              />
            )}
        </>
      )}
    </div>
  );
}