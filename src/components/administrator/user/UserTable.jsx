import React from 'react';

export default function UserTable({ users, onManageRole }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-login-frame)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[var(--color-footer-bg)]">
            <th className="border-b border-[var(--color-border)] px-5 py-3.5 text-sm font-semibold text-[var(--color-header-text)]">이름</th>
            <th className="border-b border-[var(--color-border)] px-5 py-3.5 text-sm font-semibold text-[var(--color-header-text)]">이메일</th>
            <th className="border-b border-[var(--color-border)] px-5 py-3.5 text-sm font-semibold text-[var(--color-header-text)]">유형</th>
            <th className="border-b border-[var(--color-border)] px-5 py-3.5 text-sm font-semibold text-[var(--color-header-text)]">생일</th>
            <th className="border-b border-[var(--color-border)] px-5 py-3.5 text-center text-sm font-semibold text-[var(--color-header-text)]">관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-[var(--color-footer-bg)]">
              <td className="border-t border-[var(--color-border)] px-5 py-3.5 text-sm text-[var(--color-header-text)]">{user.name}</td>
              <td className="border-t border-[var(--color-border)] px-5 py-3.5 text-sm text-[var(--color-sub-text)]">{user.email}</td>
              <td className="border-t border-[var(--color-border)] px-5 py-3.5 text-sm text-[var(--color-header-text)]">
                <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary-btn)] px-3 py-1 text-[0.8125rem] font-semibold text-[var(--color-header-text)]">
                  {user.role === '관리자' && '🛡️ '}
                  {user.role === '관제자' && '📡 '}
                  {user.role === '이용자' && '🚚 '}
                  {user.role}
                </span>
              </td>
              <td className="border-t border-[var(--color-border)] px-5 py-3.5 text-sm text-[var(--color-sub-text)]">{user.birth}</td>
              <td className="border-t border-[var(--color-border)] px-5 py-3.5 text-center text-sm text-[var(--color-header-text)]">
                <button
                  className="rounded-full border border-[var(--color-sub-text)] bg-transparent px-3.5 py-1 text-[0.8125rem] font-medium text-[var(--color-header-text)] transition-colors hover:border-[var(--color-primary-btn)] hover:bg-[var(--color-primary-btn)]"
                  onClick={() => onManageRole && onManageRole(user)}
                >
                  권한 관리
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
