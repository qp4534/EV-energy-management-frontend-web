import React from 'react';
import '../../../styles/administrator/components/StatCard.css';

export default function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      {icon && <span className="stat-card-icon">{icon}</span>}
      <div className="stat-card-info">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-value">{value}</div>
      </div>
    </div>
  );
}