import React from "react";
import { Cpu, MemoryStick, HardDrive, RotateCw, History } from "lucide-react";
import {
  useSystemStatus,
  useRefreshResourceUsage,
} from "../../../hooks/queries/useSystem";
import "../../../styles/administrator/SystemPage.css";

const RESOURCE_ICON = {
  cpu: Cpu,
  memory: MemoryStick,
  disk: HardDrive,
};

export default function SystemStatus() {
  const { data } = useSystemStatus();
  const refreshUsage = useRefreshResourceUsage();

  const resourceUsage = data?.resourceUsage ?? [];
  const deployHistory = data?.deployHistory ?? [];

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
                  {Icon && <Icon size={16} />}
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
        <h3 className="system-card-title">최근 배포 이력</h3>
        <div className="deploy-history-list">
          {deployHistory.map((entry) => (
            <div key={entry.version} className="deploy-history-row">
              <History size={16} className="deploy-history-icon" />
              <div>
                <span className="deploy-history-version">{entry.version}</span>
                <span className="deploy-history-date">{entry.date}</span>
                <p className="deploy-history-desc">{entry.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
