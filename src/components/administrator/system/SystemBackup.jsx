import React from "react";
import DataTable from "../common/DataTable";
import StatusBadge from "./StatusBadge";
import { useBackups } from "../../../hooks/queries/useSystem";
import "../../../styles/administrator/SystemPage.css";

export default function SystemBackup() {
  const { data: backups } = useBackups();

  const columns = [
    {
      key: "id",
      header: "백업 ID",
      render: (row) => <span className="system-text-black">{row.id}</span>,
    },
    {
      key: "type",
      header: "유형",
      render: (row) => <span className="system-text-muted">{row.type}</span>,
    },
    {
      key: "size",
      header: "크기",
      render: (row) => <span className="system-text-muted">{row.size}</span>,
    },
    {
      key: "completedAt",
      header: "완료 시각",
      render: (row) => (
        <span className="system-text-muted">{row.completedAt}</span>
      ),
    },
    {
      key: "status",
      header: "상태",
      align: "center",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="system-card">
      <h3 className="system-card-title">백업 이력</h3>
      <DataTable columns={columns} rows={backups ?? []} />
    </div>
  );
}
