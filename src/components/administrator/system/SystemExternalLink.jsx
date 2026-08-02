import React from "react";
import { KeyRound } from "lucide-react";
import {
  useIntegrations,
  useReissueIntegrationKey,
} from "../../../hooks/queries/useSystem";
import "../../../styles/administrator/SystemPage.css";

export default function SystemExternalLink() {
  const { data: integrations } = useIntegrations();
  const reissueKey = useReissueIntegrationKey();

  return (
    <div className="system-card">
      <h3 className="system-card-title">외부 연동 관리</h3>
      <div className="integration-list">
        {(integrations ?? []).map((integration) => (
          <div key={integration.id} className="integration-card">
            <p className="integration-name">{integration.name}</p>
            <p className="integration-desc">{integration.desc}</p>
            <div className="integration-key-row">
              <span className="integration-key">
                <KeyRound size={14} />
                {integration.maskedKey}
              </span>
              <button
                type="button"
                className="integration-reissue-btn"
                disabled={reissueKey.isPending}
                onClick={() => reissueKey.mutate(integration.id)}
              >
                재발급
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
