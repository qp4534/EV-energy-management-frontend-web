import React, { useState, useEffect } from "react";
import { Shield, Radio, Car, X } from "lucide-react";
import "../../styles/administrator/UserDetailModal.css";

/**
 * UserDetailModal
 * -----------------------------------------------------------------------
 * 관리자 콘솔 > 이용자 관리 > 유저 상세/권한 조정 모달
 *
 * props
 * ------
 * user: {
 *   name: string,
 *   email: string,
 *   role: "admin" | "controller" | "member",
 *   permissions?: { [permKey]: boolean }  // 없으면 role 기본값 사용
 * }
 * onClose: () => void
 * onSave: (updated: { role, permissions }) => void
 * onSendResetLink: () => void
 * onDeleteAccount: () => void
 */

const ROLES = [
  { key: "admin", label: "관리자", icon: Shield },
  { key: "controller", label: "관제사", icon: Radio },
  { key: "member", label: "회원(차주)", icon: Car },
];

// 권한 카테고리 정의 (표시 순서 그대로)
const PERMISSION_GROUPS = [
  {
    title: "관제 · 화재 예방",
    items: [
      { key: "dashboardView", label: "관제 대시보드 조회" },
      { key: "fireAlertHandle", label: "화재 위험 알림 수신 및 조치" },
    ],
  },
  {
    title: "배터리 진단 · 순환",
    items: [
      { key: "diagnosisView", label: "배터리 진단 결과 조회" },
      { key: "recycleManage", label: "재활용 · 재사용 등급 관리" },
    ],
  },
  {
    title: "리포트",
    items: [{ key: "reportDownload", label: "진단 · 이력 리포트 다운로드" }],
  },
  {
    title: "시스템",
    items: [
      { key: "userManage", label: "이용자 관리 및 권한 부여" },
      { key: "systemSettings", label: "시스템 설정 변경" },
    ],
  },
];

// 역할을 선택했을 때 자동으로 적용되는 기본 권한
const ROLE_DEFAULT_PERMISSIONS = {
  admin: {
    dashboardView: true,
    fireAlertHandle: true,
    diagnosisView: true,
    recycleManage: true,
    reportDownload: true,
    userManage: true,
    systemSettings: true,
  },
  controller: {
    dashboardView: true,
    fireAlertHandle: true,
    diagnosisView: true,
    recycleManage: true,
    reportDownload: true,
    userManage: false,
    systemSettings: false,
  },
  member: {
    dashboardView: false,
    fireAlertHandle: false,
    diagnosisView: true,
    recycleManage: false,
    reportDownload: true,
    userManage: false,
    systemSettings: false,
  },
};

function UserDetailModal({
  user,
  onClose,
  onSave,
  onSendResetLink,
  onDeleteAccount,
}) {
  const [role, setRole] = useState(user?.role ?? "admin");
  const [permissions, setPermissions] = useState(
    user?.permissions ?? ROLE_DEFAULT_PERMISSIONS[user?.role ?? "admin"]
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    // 모달이 다른 유저로 다시 열릴 때 상태 초기화
    setRole(user?.role ?? "admin");
    setPermissions(user?.permissions ?? ROLE_DEFAULT_PERMISSIONS[user?.role ?? "admin"]);
    setConfirmingDelete(false);
  }, [user]);

  const handleRoleSelect = (roleKey) => {
    setRole(roleKey);
    // 역할 변경 시 해당 역할의 기본 권한으로 리셋
    setPermissions(ROLE_DEFAULT_PERMISSIONS[roleKey]);
  };

  const handleTogglePermission = (permKey) => {
    setPermissions((prev) => ({ ...prev, [permKey]: !prev[permKey] }));
  };

  const handleSave = () => {
    onSave?.({ role, permissions });
  };

  const handleDeleteClick = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    onDeleteAccount?.();
  };

  if (!user) return null;

  // 회원(차주)은 관제/관리 기능이 없는 계정이므로 시스템 항목은 숨김
  const visibleGroups =
    role === "member"
      ? PERMISSION_GROUPS.filter((g) => g.title !== "시스템")
      : PERMISSION_GROUPS;

  return (
    <div className="udm-overlay" onClick={onClose}>
      <div
        className="udm-card card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="udm-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="udm-header">
          <div>
            <h2 id="udm-title" className="udm-name">
              {user.name}
            </h2>
            <div className="udm-email">{user.email}</div>
          </div>
          <button
            type="button"
            className="udm-close-btn"
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        <div className="udm-scroll">
          {/* 역할 선택 */}
          <section className="udm-section">
            <h3 className="udm-section-title">역할</h3>
            <div className="udm-role-grid">
              {ROLES.map(({ key, label, icon: Icon }) => {
                const active = role === key;
                return (
                  <button
                    type="button"
                    key={key}
                    className={`udm-role-btn${active ? " active" : ""}`}
                    onClick={() => handleRoleSelect(key)}
                  >
                    <Icon size={22} strokeWidth={1.75} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            <p className="udm-role-hint">
              역할을 선택하면 기본 권한이 자동으로 적용됩니다. 아래에서 개별 조정할 수 있습니다.
            </p>
          </section>

          {/* 개별 권한 조정 */}
          <section className="udm-section">
            <h3 className="udm-section-title">개별 권한 조정</h3>
            {visibleGroups.map((group) => (
              <div className="udm-perm-group" key={group.title}>
                <div className="udm-perm-group-title">{group.title}</div>
                {group.items.map((item) => (
                  <label className="udm-perm-row" key={item.key}>
                    <span>{item.label}</span>
                    <span
                      className={`udm-checkbox${
                        permissions[item.key] ? " checked" : ""
                      }`}
                      role="checkbox"
                      aria-checked={!!permissions[item.key]}
                      tabIndex={0}
                      onClick={() => handleTogglePermission(item.key)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleTogglePermission(item.key);
                        }
                      }}
                    >
                      {permissions[item.key] && (
                        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                          <path
                            d="M3 8.5L6.2 11.5L13 4.5"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </section>

          {/* 계정 관리 (본인 계정이 아닐 때만 표시) */}
          {(onSendResetLink || onDeleteAccount) && (
            <section className="udm-section udm-account-section">
              <h3 className="udm-section-title">계정 관리</h3>

              {onSendResetLink && (
                <div className="udm-account-row">
                  <div>
                    <div className="udm-account-row-title">비밀번호 변경</div>
                    <div className="udm-account-row-desc">
                      가입 이메일로 비밀번호 재설정 링크를 전송합니다.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="udm-btn udm-btn-outline"
                    onClick={onSendResetLink}
                  >
                    재설정 링크 전송
                  </button>
                </div>
              )}

              {onDeleteAccount && (
                <div className="udm-account-row udm-danger-row">
                  <div>
                    <div className="udm-account-row-title udm-danger-text">회원 탈퇴</div>
                    <div className="udm-account-row-desc udm-danger-text">
                      계정과 권한 정보가 즉시 삭제되며 되돌릴 수 없습니다.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="udm-btn udm-btn-danger"
                    onClick={handleDeleteClick}
                  >
                    {confirmingDelete ? "정말 탈퇴하시겠습니까?" : "회원 탈퇴"}
                  </button>
                </div>
              )}
            </section>
          )}
        </div>

        {/* 푸터 */}
        <div className="udm-footer">
          <button type="button" className="udm-btn udm-btn-outline" onClick={onClose}>
            취소
          </button>
          <button type="button" className="udm-btn udm-btn-primary" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;