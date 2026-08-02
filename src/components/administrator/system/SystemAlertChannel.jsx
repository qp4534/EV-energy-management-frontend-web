import React from "react";
import { SquareCheck, Square } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import {
  useNotificationChannels,
  useUpdateNotificationChannel,
  useRiskChannelMatrix,
  useUpdateRiskChannelCell,
} from "../../../hooks/queries/useSystem";
import "../../../styles/administrator/SystemPage.css";

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
            {(matrix?.rows ?? []).map((row) => (
              <tr key={row.level}>
                <td>{row.level}</td>
                {(matrix?.channels ?? []).map((channel) => (
                  <td key={channel.key} className="system-table__td--center">
                    <button
                      type="button"
                      className="matrix-check-btn"
                      aria-pressed={row[channel.key]}
                      onClick={() =>
                        updateCell.mutate({
                          level: row.level,
                          channelKey: channel.key,
                          checked: !row[channel.key],
                        })
                      }
                    >
                      {row[channel.key] ? (
                        <SquareCheck size={18} className="matrix-check-on" />
                      ) : (
                        <Square size={18} className="matrix-check-off" />
                      )}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
