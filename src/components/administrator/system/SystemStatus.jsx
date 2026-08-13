import React from "react";
import { Cpu, MemoryStick, HardDrive, RotateCw } from "lucide-react";
import { useResourceUsage, useRefreshResourceUsage } from "../../../hooks/queries/useSystem";
import "../../../styles/administrator/SystemPage.css";

const RESOURCE_ICON = {
  cpu: Cpu,
  memory: MemoryStick,
  disk: HardDrive,
};

// 배포 이력은 별도로 기록해두는 곳(테이블)이 없어서 지금은 제공하지 않음.
// 리소스 사용률은 저장된 값이 아니라, 조회하는 그 순간의 서버 상태를 그대로 보여줌.
export default function SystemStatus() {
  const { data: resourceUsage = [] } = useResourceUsage();
  const refreshUsage = useRefreshResourceUsage();

  return (
    <div className="system-tab-columns">
      <div className="system-card">
        <div className="system-card-header-row">
          <h3 className="system-card-title">리소스 사용량</h3>
          <button
            type="button"
            className="resource-refresh-btn"
            disabled={refreshUsage.isPending}
            onClick={() => refreshUsage.mutate()}
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
    </div>
  );
}