import React from 'react';

export default function StatCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-login-frame)] p-5">
      {icon && <span className="text-2xl text-[var(--color-header-text)]">{icon}</span>}
      <div className="flex flex-col">
        <span className="text-sm text-[var(--color-sub-text)]">{label}</span>
        <div className="mt-1 text-2xl leading-tight font-bold text-[var(--color-header-text)]">
          {value}
        </div>
      </div>
    </div>
  );
}
