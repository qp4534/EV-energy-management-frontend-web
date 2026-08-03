import React from "react";
import { CircleCheck, CircleAlert } from "lucide-react";
import "../../../styles/administrator/SystemPage.css";

/**
 * @param {"success"|"error"} status
 * @param {string} [successLabel]
 * @param {string} [errorLabel]
 */
export default function StatusBadge({ status, successLabel = "정상", errorLabel = "오류" }) {
  const isSuccess = status === "success";
  return (
    <span className={`status-badge ${isSuccess ? "status-badge--success" : "status-badge--error"}`}>
      {isSuccess ? (
        <CircleCheck size={14} />
      ) : (
        <CircleAlert size={14} fill="#ca2b2e" color="#ffffff" />
      )}
      {isSuccess ? successLabel : errorLabel}
    </span>
  );
}
