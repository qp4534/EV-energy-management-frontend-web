import React from "react";
import { Maximize2 } from "lucide-react";
import ExpandButton from "../../ExpandButton";
import "../../../styles/administrator/components/CardShell.css";

export default function CardShell({ title, children, expandTo, onExpand }) {
  const hasExpandAction = Boolean(expandTo || onExpand);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {hasExpandAction ? (
          <ExpandButton to={expandTo} onClick={onExpand} />
        ) : (
          <Maximize2 size={15} className="card-expand-icon" />
        )}
      </div>
      {children}
    </div>
  );
}