import { useState } from "react";
import SystemTabs from "../../components/administrator/system/SystemTabs";
import SystemAlertChannel from "../../components/administrator/system/SystemAlertChannel";
import SystemExternalLink from "../../components/administrator/system/SystemExternalLink";
import SystemBatchJob from "../../components/administrator/system/SystemBatchJob";
import SystemStatus from "../../components/administrator/system/SystemStatus";
import SystemBackup from "../../components/administrator/system/SystemBackup";
import "../../styles/administrator/SystemPage.css";

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState("alertChannel");

  return (
    <div className="system-page">
      <h2 className="system-page-title">시스템 관리</h2>

      <SystemTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "alertChannel" && <SystemAlertChannel />}
      {activeTab === "externalLink" && <SystemExternalLink />}
      {activeTab === "batchJob" && <SystemBatchJob />}
      {activeTab === "status" && <SystemStatus />}
      {activeTab === "backup" && <SystemBackup />}
    </div>
  );
}
