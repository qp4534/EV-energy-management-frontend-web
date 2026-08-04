import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import TabBar from "../../components/administrator/common/TabBar";
import LineChartCard from "../../components/administrator/statsreport/LineChartCard";
import DonutCard from "../../components/administrator/statsreport/DonutCard";
import StatCard from "../../components/administrator/main/StatCard";
import CardShell from "../../components/administrator/common/CardShell";
import RiskLevelCard from "../../components/administrator/statsreport/RiskLevelCard";
import ProcessStatCard from "../../components/administrator/statsreport/ProcessStatCard";
import DataTable from "../../components/administrator/common/DataTable";
import {
  dateRangeLabel,
  memberTrend,
  userTypeDistribution,
  summaryStats,
  fireSummaryStats,
  fireRiskLevels,
  fireRiskTotal,
  batteryDiagnosisTrend,
  batterySohTrend,
  batteryGradeDistribution,
  batteryGradeTotal,
  batteryProcessingStats,
  recentBatteryProcessing,
} from "../../mocks/statsReportMock";

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

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] p-8">
      {/* 헤더: 타이틀 + 기간 선택 */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[var(--color-header-text)]">통계 / 리포트 조회</h2>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-login-frame)] px-4 py-2 text-sm text-[var(--color-header-text)] hover:bg-[var(--color-bg-main)]"
        >
          {dateRangeLabel}
          <ChevronDown size={16} className="text-[var(--color-sub-text)]" />
        </button>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "user" && (
        <>
          <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <LineChartCard
              title="월별 가입자 추이"
              data={memberTrend}
              dataKey="가입자수"
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
                  {summaryStats.totalUsers.toLocaleString()}
                  <span className="ml-1 text-base font-normal">명</span>
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    전월 대비 +{summaryStats.totalUsersDelta}명
                  </span>
                </span>
              }
            />

            <StatCard
              label="활성률"
              value={
                <span>
                  {summaryStats.activeRate}
                  <span className="ml-1 text-base font-normal">%</span>
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    전월 대비 +{summaryStats.activeRateDelta}%p
                  </span>
                </span>
              }
            />

            <StatCard
              label="이번 달 신규 이용자"
              value={
                <span>
                  {summaryStats.newUsersThisMonth}
                  <span className="ml-1 text-base font-normal">명</span>
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    일반 회원 {summaryStats.newUsersGeneral}명 · 관제자 {summaryStats.newUsersController}명
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
              data={batteryDiagnosisTrend}
              dataKey="진단건수"
              color="var(--color-header-text)"
              unit="건"
            />
 
            <LineChartCard
              title="평균 SOH 추이"
              data={batterySohTrend}
              dataKey="평균SOH"
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
            <ProcessStatCard title="배터리 처리" items={batteryProcessingStats} />
          </div>
 
          <div className="mt-5">
            <CardShell title="최근 처리 이력">
              <div className="overflow-x-auto">
                <DataTable
                  columns={[
                    { key: "batteryId", header: "배터리 ID" },
                    { key: "grade", header: "판정 등급" },
                    { key: "processType", header: "처리 유형" },
                    { key: "processedAt", header: "처리일" },
                  ]}
                  rows={recentBatteryProcessing}
                />
              </div>
            </CardShell>
          </div>
        </>
      )}
      {activeTab === "fire" && (
        <>
          <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard
              label="이번 달 알림 발생 건수"
              value={
                <span>
                  {fireSummaryStats.alertCount}
                  <span className="ml-1 text-base font-normal">건</span>
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    전월 대비 {fireSummaryStats.alertCountDelta > 0 ? "+" : ""}
                    {fireSummaryStats.alertCountDelta}건
                  </span>
                </span>
              }
            />

            <StatCard
              label="대응율"
              value={
                <span>
                  {fireSummaryStats.responseRate}
                  <span className="ml-1 text-base font-normal">%</span>
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    전월 대비 {fireSummaryStats.responseRateDelta > 0 ? "+" : ""}
                    {fireSummaryStats.responseRateDelta}%p
                  </span>
                </span>
              }
            />

            <StatCard
              label="평균 대응 시간"
              value={
                <span>
                  {fireSummaryStats.avgResponseMinutes}
                  <span className="ml-1 text-base font-normal">분</span>
                  <span className="mt-1 block text-xs font-normal text-[var(--color-sub-text)]">
                    전월 대비 {fireSummaryStats.avgResponseMinutesDelta > 0 ? "+" : ""}
                    {fireSummaryStats.avgResponseMinutesDelta}분
                  </span>
                </span>
              }
            />
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
