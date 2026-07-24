import React from "react";

export default function Sidebar({ role }) {
  return (
    <div className="sidebar">
      {role === "controller" ? (
        <ul>
          <li>Controller Menu Item 1</li>
          <li>Controller Menu Item 2</li>
          <li>Controller Menu Item 3</li>
        </ul>
      ) : (
        <ul>
          <li>Administrator Menu Item 1</li>
          <li>Administrator Menu Item 2</li>
          <li>Administrator Menu Item 3</li>
        </ul>
      )}
    </div>
  );
}
