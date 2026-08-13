import React, { useState } from 'react';
import '../../../styles/administrator/components/UserPermissionModal.css';

// '회원(차주)' 기본 권한은 참고 화면에 없어서 조회 위주로 임의 설정했습니다.
// 실제 정책에 맞게 ROLE_DEFAULTS.차주 값만 조정하세요.
const ROLES = [
  { key: '관리자', label: '관리자', icon: '🛡️' },
  { key: '관제자', label: '관제자', icon: '📡' },
  { key: '이용자', label: '이용자', icon: '🚚' },
];

const PERMISSION_GROUPS = [
  {
    title: '관제 · 화재 예방',
    items: [
      { key: 'dashboard_view', label: '관제 대시보드 조회' },
      { key: 'fire_alert', label: '화재 위험 알림 수신 및 조치' },
    ],
  },
  {
    title: '배터리 진단 · 순환',
    items: [
      { key: 'battery_diag_view', label: '배터리 진단 결과 조회' },
      { key: 'battery_grade_manage', label: '재활용 · 재사용 등급 관리' },
    ],
  },
  {
    title: '리포트',
    items: [{ key: 'report_download', label: '진단 · 이력 리포트 다운로드' }],
  },
  {
    title: '시스템',
    items: [
      { key: 'user_manage', label: '이용자 관리 및 권한 부여' },
      { key: 'system_setting', label: '시스템 설정 변경' },
    ],
  },
];

const ROLE_DEFAULTS = {
  관리자: {
    dashboard_view: true,
    fire_alert: true,
    battery_diag_view: true,
    battery_grade_manage: true,
    report_download: true,
    user_manage: true,
    system_setting: true,
  },
  관제자: {
    dashboard_view: true,
    fire_alert: true,
    battery_diag_view: true,
    battery_grade_manage: true,
    report_download: true,
    user_manage: false,
    system_setting: false,
  },
  차주: {
    dashboard_view: true,
    fire_alert: false,
    battery_diag_view: true,
    battery_grade_manage: false,
    report_download: false,
    user_manage: false,
    system_setting: false,
  },
};

// ROLE_DEFAULTS에 없는 role(예: 백엔드 mock의 '이용자')이 들어와도
// 죽지 않도록 하는 안전망. 전 권한 false로 시작한다.
const FALLBACK_PERMISSIONS = PERMISSION_GROUPS.reduce((acc, group) => {
  group.items.forEach((item) => {
    acc[item.key] = false;
  });
  return acc;
}, {});

export default function UserPermissionModal({ user, onClose, onSave, onResetPassword, onDeleteUser }) {
  // ROLES에 없는 role(예: '이용자')이 들어오면 role 버튼 중 아무것도
  // 선택되지 않은 상태로 시작한다 (크래시는 안 나고, UI상 미선택으로만 보임).
  const [role, setRole] = useState(user?.role ?? '관제자');

  // 저장된 권한이 있으면(빈 객체가 아니면) 그대로 사용,
  // 없으면 role 기본값, 그마저도 없으면(알 수 없는 role) 안전한 fallback 사용
  const initialPermissions =
    user?.permissions && Object.keys(user.permissions).length > 0
      ? user.permissions
      : ROLE_DEFAULTS[user?.role] ?? FALLBACK_PERMISSIONS;

  const [permissions, setPermissions] = useState(initialPermissions);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setPermissions(ROLE_DEFAULTS[nextRole] ?? FALLBACK_PERMISSIONS); // role을 직접 바꾸면 기본값으로 리셋 (의도된 동작)
  };

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...(prev ?? FALLBACK_PERMISSIONS), [key]: !prev?.[key] }));
  };

  const handleResetPassword = async () => {
    if (!onResetPassword || isResetting) return;
    try {
      setIsResetting(true);
      await onResetPassword(user);
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!onDeleteUser || isDeleting) return;
    const confirmed = window.confirm(
      `${user.name} 님을 정말 탈퇴 처리하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
    );
    if (!confirmed) return;
    try {
      setIsDeleting(true);
      await onDeleteUser(user);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  const showAccountSection = role !== '관리자';

  return (
    <div className="permission-modal-overlay" onClick={onClose}>
      <div className="permission-modal" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="permission-modal-header">
          <div>
            <h2>{user.name}</h2>
            <p className="sub">{user.email}</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        {/* 역할 선택 */}
        <div className="permission-section">
          <h3>역할</h3>
          <div className="role-grid">
            {ROLES.map(({ key, label, icon }) => (
              <button
                key={key}
                className={`role-btn ${role === key ? 'active' : ''}`}
                onClick={() => handleRoleChange(key)}
              >
                <span className="role-icon">{icon}</span>
                {label}
              </button>
            ))}
          </div>
          <p className="helper-text">
            역할을 선택하면 기본 권한이 자동으로 적용됩니다. 아래에서 개별 조정할 수 있습니다.
          </p>
        </div>

        {/* 개별 권한 조정 */}
        <div className="permission-section">
          <h3>개별 권한 조정</h3>
          {PERMISSION_GROUPS.map((group) => (
            <div key={group.title} className="permission-group">
              <p className="group-title">{group.title}</p>
              {group.items.map((item) => (
                <label key={item.key} className="permission-row">
                  {item.label}
                  <input
                    type="checkbox"
                    checked={!!permissions[item.key]}
                    onChange={() => togglePermission(item.key)}
                  />
                </label>
              ))}
            </div>
          ))}
        </div>

        {/* 계정 관리: 관리자는 숨김 */}
        {showAccountSection && (
          <div className="permission-section account-section">
            <h3>계정 관리</h3>

            <div className="account-row">
              <div>
                <p className="account-title">비밀번호 변경</p>
                <p className="sub">가입 이메일로 비밀번호 재설정 인증 코드를 전송합니다.</p>
              </div>
              <button
                className="account-btn primary"
                onClick={handleResetPassword}
                disabled={isResetting}
              >
                {isResetting ? '전송 중...' : '재설정 코드 전송'}
              </button>
            </div>

            <div className="account-row danger">
              <div>
                <p className="account-title">회원 탈퇴</p>
                <p className="sub">계정과 권한 정보가 즉시 삭제되며 되돌릴 수 없습니다.</p>
              </div>
              <button
                className="account-btn danger"
                onClick={handleDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? '처리 중...' : '회원 탈퇴'}
              </button>
            </div>
          </div>
        )}

        {/* 저장 */}
        <div className="permission-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button
            className="save-btn"
            onClick={() => onSave?.({ ...user, role, permissions })}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}