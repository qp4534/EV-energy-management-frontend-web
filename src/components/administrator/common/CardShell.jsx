import React from "react";
import ExpandButton from "../../ExpandButton";

export default function CardShell({ title, children, expandTo, onExpand }) {
  const hasExpandAction = Boolean(expandTo || onExpand);

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="m-0 text-[15px] font-bold text-[var(--color-header-text)]">
          {title}
        </h3>
        {hasExpandAction && <ExpandButton to={expandTo} onClick={onExpand} />}
      </div>
      {children}
    </div>
  );
}