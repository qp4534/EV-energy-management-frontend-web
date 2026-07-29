import React from "react";
import { Maximize2 } from "lucide-react";
import "../../styles/administrator/components/CardShell.css";

export default function CardShell({ title, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <Maximize2 size={15} className="card-expand-icon" />
      </div>
      {children}
    </div>
  );
}