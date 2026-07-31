import React from "react";
import "../../../styles/administrator/components/ProposalSection.css";

export default function ProposalSection({ title, children }) {
  return (
    <div className="judgement-card proposal-section">
      <h2 className="proposal-section-title">{title}</h2>
      {children}
    </div>
  );
}