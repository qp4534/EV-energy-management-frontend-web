import React, { useState } from "react";
import TabBar from "../../components/administrator/common/TabBar";
import LineChartCard from "../../components/administrator/statsreport/LineChartCard";
import LineTrendChart from "../../components/administrator/common/LineTrendChart";
import DonutCard from "../../components/administrator/statsreport/DonutCard";
import StatCard from "../../components/administrator/main/StatCard";
import CardShell from "../../components/administrator/common/CardShell";
import RiskLevelCard from "../../components/administrator/statsreport/RiskLevelCard";
import MetricStatCard from "../../components/administrator/statsreport/MetricStatCard";
import DataTable from "../../components/administrator/common/DataTable";
import {
  useUserTypeDistribution,
  useMemberTrend,
  useUserSummaryStats,
  useBatteryDiagnosisTrend,
  useBatterySohTrend,
  useBatteryGradeDistribution,
  useBatteryMetricAverage,
  useRecentDiagnoses,
  useVehicleRiskOverview,
  useFireSummaryStats,
  useAlertTrend,
} from "../../hooks/queries/useStatsReport";

const TABS = [
  { key: "user", label: "이용자" },
  { key: "battery", label: "배터리 진단" },
  { key: "fire", label: "화재 예방" },
];

function PlaceholderCard() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-login-frame)] p-6 text-sm text-[var(--color-btn-desc)]">
      준비 중인 화면입니다.
    </div>
  );
}

export default function StatsReport() {
  const [activeTab, setActiveTab] = useState("user");

  const { data: userTypeRaw } = useUserTypeDistribution();
  const { data: memberTrendRaw } = useMemberTrend();
  const { data: summaryStats } = useUserSummaryStats();
  const { data: batteryDiagnosisTrend } = useBatteryDiagnosisTrend();
  const { data: batterySohTrend } = useBatterySohTrend();
  const { data: batteryGradeDistributionRaw } = useBatteryGradeDistribution();
  const { data: metricAverage } = useBatteryMetricAverage();
  const { data: recentDiagnosesRaw } = useRecentDiagnoses(6);
  const { data: vehicleRiskOverview } = useVehicleRiskOverview();
  const { data: fireSummaryStats } = useFireSummaryStats();
  const [alertTrendMonths, setAlertTrendMonths] = useState(6);
  const { data: alertTrend } = useAlertTrend(alertTrendMonths);

  const ROLE_COLORS = { 관리자: "#FFE88A", 관제자: "#FF8D72", 이용자: "#A8F56B" };
  const userTypeDistribution = (userTypeRaw ?? []).map((r) => ({
    name: r.role,
    value: r.count,
    color: ROLE_COLORS[r.role] ?? "#cccccc",
  }));
  const memberTrend = memberTrendRaw ?? [];

  const batteryGradeDistribution = batteryGradeDistributionRaw ?? [];
  const batteryGradeTotal = batteryGradeDistribution.reduce((sum, g) => sum + g.count, 0);

  // 진단 지표 평균 4종
  const METRIC_COLORS = {
    remainingLife: "var(--color-header-text)",
    dischargePower: "#1F8FCC",
    chargeHealth: "#E19A3C",
    voltageStability: "#E15B5B",
  };
  const batteryMetricStats = [
    { key: "remainingLife", label: "잔존수명 평균", value: metricAverage?.remainingLifeAvg ?? 0 },
    { key: "dischargePower", label: "방전출력 평균", value: metricAverage?.dischargePowerAvg ?? 0 },
    { key: "chargeHealth", label: "충전건강도 평균", value: metricAverage?.chargeHealthAvg ?? 0 },
    { key: "voltageStability", label: "전압안정성 평균", value: metricAverage?.voltageStabilityAvg ?? 0 },
  ];

  // 최근 진단 이력
  const recentDiagnoses = (recentDiagnosesRaw ?? []).map((d) => ({
    batteryId: d.batteryId,
    grade: d.grade ?? "-",
    sohScore: d.sohScore != null ? `${d.sohScore}%` : "-",
    inspectedAt: d.inspectedAt,
  }));

  // 화재예방 "위험등급별 차량 수" - 이미 있는 대시보드용 엔드포인트(vehicle-risk-overview) 재사용
  const riskSummary = vehicleRiskOverview?.summary;
  const fireRiskLevels = [
    { key: "normal", label: "양호", count: riskSummary?.normal ?? 0 },
    { key: "caution", label: "보통", count: riskSummary?.caution ?? 0 },
    { key: "warning", label: "위험", count: riskSummary?.warning ?? 0 },
    { key: "emergency", label: "긴급", count: riskSummary?.emergency ?? 0 },
  ];
  const fireRiskTotal = riskSummary?.total ?? 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-8">
      {/* 헤더 */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--color-header-text)]">통계 / 리포트 조회</h2>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "user" && (
        <>
          <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <LineChartCard
              title="월별 가입자 추이"
              data={memberTrend}
              dataKey="totalUsers"
              color="var(--color-header-text)"
              unit="명"
            />

            <DonutCard
              title="유형별 분포"
              centerLabel="이용자"
              data={userTypeDistribution}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard
              label="전체 이용자"
              value={
                <span>
                  {(summaryStats?.totalUsers ?? 0).toLocaleString()}
                  <span className="ml-1 text-base font-normal">명</span>
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    전월 대비 +{summaryStats?.totalUsersDelta ?? 0}명
                  </span>
                </span>
              }
            />

            <StatCard
              label="활성률"
              value={
                <span>
                  {summaryStats?.activeRate ?? 0}
                  <span className="ml-1 text-base font-normal">%</span>
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    전월 대비 +{summaryStats?.activeRateDelta ?? 0}%p
                  </span>
                </span>
              }
            />

            <StatCard
              label="이번 달 신규 이용자"
              value={
                <span>
                  {summaryStats?.newUsersThisMonth ?? 0}
                  <span className="ml-1 text-base font-normal">명</span>
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    일반 회원 {summaryStats?.newUsersGeneral ?? 0}명 · 관제자 {summaryStats?.newUsersController ?? 0}명
                  </span>
                </span>
              }
            />
          </div>
        </>
      )}

      {activeTab === "battery" && (
        <>
          <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <LineChartCard
              title="월별 진단 건수"
              data={batteryDiagnosisTrend ?? []}
              dataKey="count"
              color="var(--color-header-text)"
              unit="건"
            />
 
            <LineChartCard
              title="평균 SOH 추이"
              data={batterySohTrend ?? []}
              dataKey="avgSoh"
              color="var(--color-header-text)"
              unit="%"
            />
          </div>
 
          <CardShell title="배터리 등급별 분포">
            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-3">
              {batteryGradeDistribution.map((grade) => (
                <RiskLevelCard
                  key={grade.key}
                  type={grade.key}
                  label={grade.label}
                  count={grade.count}
                  total={batteryGradeTotal}
                />
              ))}
            </div>
          </CardShell>
 
          <div className="mt-5">
            <CardShell title="배터리 진단 지표 평균">
              <div className="grid grid-cols-2 gap-4 pt-1 sm:grid-cols-4">
                {batteryMetricStats.map((metric) => (
                  <MetricStatCard
                    key={metric.key}
                    label={metric.label}
                    value={metric.value}
                    color={METRIC_COLORS[metric.key]}
                  />
                ))}
              </div>
            </CardShell>
          </div>
 
          <div className="mt-5">
            <CardShell title="최근 진단 이력">
              <div className="overflow-x-auto">
                <DataTable
                  columns={[
                    { key: "batteryId", header: "배터리 ID" },
                    { key: "grade", header: "판정 등급" },
                    { key: "sohScore", header: "SOH" },
                    { key: "inspectedAt", header: "점검일" },
                  ]}
                  rows={recentDiagnoses}
                />
              </div>
            </CardShell>
          </div>
        </>
      )}
      {activeTab === "fire" && (
        <>
          <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <StatCard
              label="이번 달 알림 발생 건수"
              value={
                <span>
                  {fireSummaryStats?.alertCount ?? 0}
                  <span className="ml-1 text-base font-normal">건</span>
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    전월 대비 {(fireSummaryStats?.alertCountDelta ?? 0) > 0 ? "+" : ""}
                    {fireSummaryStats?.alertCountDelta ?? 0}건
                  </span>
                </span>
              }
            />

            <StatCard
              label="가장 흔한 이상 유형"
              value={
                <span>
                  {fireSummaryStats?.topAbnormalType ?? "-"}
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    이번 달 {fireSummaryStats?.topAbnormalTypeCount ?? 0}건 발생
                  </span>
                </span>
              }
            />
          </div>

          <div className="mb-5">
            <CardShell
              title={
                <div className="flex w-full items-center justify-between">
                  <span>월별 알림 발생 추이</span>
                  <select
                    value={alertTrendMonths}
                    onChange={(e) => setAlertTrendMonths(Number(e.target.value))}
                    className="ml-4 shrink-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-login-frame)] px-3 py-1.5 text-xs font-medium text-[var(--color-header-text)] shadow-sm outline-none hover:bg-[var(--color-bg-main)]"
                  >
                    <option value={3}>최근 3개월</option>
                    <option value={6}>최근 6개월</option>
                    <option value={12}>최근 12개월</option>
                  </select>
                </div>
              }
            >
              <LineTrendChart
                data={alertTrend ?? []}
                dataKey="count"
                color="var(--color-header-text)"
                unit="건"
              />
            </CardShell>
          </div>

          <CardShell title="현재 위험등급별 차량 수">
            <div className="grid grid-cols-2 gap-4 pt-1 sm:grid-cols-4">
              {fireRiskLevels.map((level) => (
                <RiskLevelCard
                  key={level.key}
                  type={level.key}
                  label={level.label}
                  count={level.count}
                  total={fireRiskTotal}
                />
              ))}
            </div>
          </CardShell>
        </>
      )}
    </div>
  );
}