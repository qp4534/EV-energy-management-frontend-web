import React from "react";
import { Cpu, MemoryStick, HardDrive, RotateCw } from "lucide-react";
import { useSystemStatus, useRefreshResourceUsage } from "../../../hooks/queries/useSystem";
import "../../../styles/administrator/SystemPage.css";

const RESOURCE_ICON = {
  cpu: Cpu,
  memory: MemoryStick,
  disk: HardDrive,
};

// 리소스 사용률은 저장된 값이 아니라, 조회하는 그 순간의 서버 상태를 그대로 보여줌.
// 배포 이력은 systemService.getSystemStatus()가 리소스 사용량이랑 같이 내려줌.
export default function SystemStatus() {
  const { data, refetch } = useSystemStatus();
  const resourceUsage = data?.resourceUsage ?? [];
  const deployHistory = data?.deployHistory ?? [];
  const refreshUsage = useRefreshResourceUsage();

  const handleRefresh = async () => {
    await refreshUsage.mutateAsync();
    refetch(); // 리소스 사용량 새로고침 후, 화면에 보이는 systemStatus도 같이 갱신
  };

  return (
    <div className="system-tab-columns">
      <div className="system-card">
        <div className="system-card-header-row">
          <h3 className="system-card-title">리소스 사용량</h3>
          <button
            type="button"
            className="resource-refresh-btn"
            disabled={refreshUsage.isPending}
            onClick={handleRefresh}
          >
            <RotateCw size={13} className={refreshUsage.isPending ? "spinning" : ""} />
            새로 고침
          </button>
        </div>

        <div className="resource-usage-list">
          {resourceUsage.map((item) => {
            const Icon = RESOURCE_ICON[item.key];
            return (
              <div key={item.key} className="resource-usage-row">
                <div className="resource-usage-label">
                  {Icon && <Icon size={16} className="resource-usage-icon" />}
                  <span>{item.label}</span>
                  <span className="resource-usage-percent">{item.percent}%</span>
                </div>
                <div className="resource-usage-bar-track">
                  <div
                    className="resource-usage-bar-fill"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="system-card">
        <h3 className="system-card-title">배포 이력</h3>
        <table className="system-table">
          <thead>
            <tr>
              <th>버전</th>
              <th>일시</th>
              <th>내용</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {deployHistory.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.version}</td>
                <td>{entry.date}</td>
                <td>{entry.desc}</td>
                <td>{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}