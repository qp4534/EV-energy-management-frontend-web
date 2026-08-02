import React from "react";
import { Play } from "lucide-react";
import DataTable from "../common/DataTable";
import StatusBadge from "./StatusBadge";
import { useBatchJobs, useRunBatchJob } from "../../../hooks/queries/useSystem";
import "../../../styles/administrator/SystemPage.css";

export default function SystemBatchJob() {
  const { data: jobs } = useBatchJobs();
  const runJob = useRunBatchJob();

  const columns = [
    { key: "name", header: "작업명" },
    { key: "cycle", header: "주기" },
    {
      key: "lastRun",
      header: "마지막 실행",
      render: (row) => (
        <div className="batch-job-last-run">
          <span>{row.lastRun}</span>
          <span className="batch-job-last-run-sub">{row.lastRunResult}</span>
        </div>
      ),
    },
    { key: "nextRun", header: "다음 실행" },
    {
      key: "status",
      header: "상태",
      align: "center",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "action",
      header: "",
      align: "center",
      render: (row) => (
        <button
          type="button"
          className="batch-job-run-btn"
          disabled={runJob.isPending}
          onClick={() => runJob.mutate(row.id)}
        >
          <Play size={13} />
          수동 실행
        </button>
      ),
    },
  ];

  return (
    <div className="system-card">
      <h3 className="system-card-title">배치 작업 스케줄</h3>
      <DataTable columns={columns} rows={jobs ?? []} />
    </div>
  );
}
