import React from 'react';
import '../../../styles/administrator/components/UserTable.css';

export default function UserTable({ users, onManageRole }) {
  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>유형</th>
            <th>생일</th>
            <th className="text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td className="sub">{user.email}</td>
              <td>
                <span className="role-badge">
                  {user.role === '관리자' && '🛡️ '}
                  {user.role === '관제사' && '📡 '}
                  {user.role === '차주' && '🚚 '}
                  {user.role}
                </span>
              </td>
              <td className="sub">{user.birth}</td>
              <td className="text-center">
                <button 
                  className="action-btn"
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