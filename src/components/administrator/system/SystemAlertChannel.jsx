import React from "react";
import { Check } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import {
  useNotificationChannels,
  useUpdateNotificationChannel,
  useRiskChannelMatrix,
  useUpdateRiskChannelCell,
} from "../../../hooks/queries/useSystem";
import "../../../styles/administrator/SystemPage.css";

// 백엔드가 "긴급" 등급은 항상 켜짐으로 강제 저장하도록 막아둬서, 여기서도 동일하게
// 이 등급 행은 클릭 자체를 막고 항상 체크된 상태로 보여줌.
const EMERGENCY_LEVEL = "긴급";

export default function SystemAlertChannel() {
  const { data: channels } = useNotificationChannels();
  const updateChannel = useUpdateNotificationChannel();

  const { data: matrix } = useRiskChannelMatrix();
  const updateCell = useUpdateRiskChannelCell();

  return (
    <div className="system-tab-columns">
      <div className="system-card">
        <h3 className="system-card-title">채널 활성화</h3>
        <div className="channel-toggle-list">
          {(channels ?? []).map((channel) => (
            <div key={channel.key} className="channel-toggle-row">
              <div>
                <p className="channel-toggle-label">{channel.label}</p>
                <p className="channel-toggle-desc">{channel.desc}</p>
              </div>
              <ToggleSwitch
                checked={channel.enabled}
                onChange={(next) =>
                  updateChannel.mutate({ key: channel.key, enabled: next })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="system-card">
        <h3 className="system-card-title">위험도별 발송 매트릭스</h3>
        <table className="system-table">
          <thead>
            <tr>
              <th>위험도</th>
              {(matrix?.channels ?? []).map((channel) => (
                <th key={channel.key} className="system-table__th--center">
                  {channel.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(matrix?.rows ?? []).map((row) => {
              const isEmergencyRow = row.level === EMERGENCY_LEVEL;
              return (
                <tr key={row.level}>
                  <td>{row.level}</td>
                  {(matrix?.channels ?? []).map((channel) => {
                    const cell = row[channel.key];
                    // 긴급 행은 실제 값과 무관하게 항상 켜짐으로 보여주고, 클릭도 막음
                    const checked = isEmergencyRow ? true : Boolean(cell?.enabled);
                    return (
                      <td key={channel.key} className="system-table__td--center">
                        <button
                          type="button"
                          className="matrix-check-btn"
                          aria-pressed={checked}
                          disabled={isEmergencyRow}
                          title={isEmergencyRow ? "긴급 등급은 항상 알림이 발송됩니다" : undefined}
                          onClick={() => {
                            if (isEmergencyRow || !cell) return;
                            updateCell.mutate({
                              matrixId: cell.matrixId,
                              level: row.level,
                              channelKey: channel.key,
                              checked: !cell.enabled,
                            });
                          }}
                        >
                          <span
                            className={`matrix-checkbox ${
                              checked ? "matrix-checkbox--checked" : ""
                            } ${isEmergencyRow ? "matrix-checkbox--locked" : ""}`}
                          >
                            {checked && (
                              <Check size={12} className="matrix-checkbox-icon" />
                            )}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}