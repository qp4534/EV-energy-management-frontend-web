import React, { useState, useMemo, useEffect } from 'react';
import StatCard from '../../components/administrator/main/StatCard';
import SearchFilterSection from '../../components/administrator/user/SearchFilterSection';
import UserTable from '../../components/administrator/user/UserTable';
import UserPermissionModal from '../../components/administrator/user/UserPermissionModal';
import Pagination from '../../components/common/Pagination';
import {
  useUsers,
  useUpdateUser,
  useDeleteUser,
  useRequestPasswordReset,
} from '../../hooks/queries/useUser';
import '../../styles/administrator/UserManage.css';

const PAGE_SIZE = 10; // 페이지당 표시할 회원 수

// TODO: 백엔드 UserDto에 name 필드가 없어서 임시로 이메일 앞부분을 표시 이름으로 사용
const mapUserForDisplay = (user) => ({
  ...user,
  id: user.userId,
  name: user.email?.split('@')[0] ?? '이름없음',
});

export default function UserManage() {
  // 회원 목록 조회 (react-query가 로딩/에러/캐싱 관리)
  const { data, isLoading, error } = useUsers();
  const users = useMemo(() => (data ?? []).map(mapUserForDisplay), [data]);

  // 저장/탈퇴/비밀번호 재설정 — 성공 시 useUser.js 훅 내부에서 목록(['users']) 자동 재조회
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useRequestPasswordReset();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');
  const [selectedUser, setSelectedUser] = useState(null); // 권한 관리 모달 대상
  const [currentPage, setCurrentPage] = useState(1);

  // 통계: 별도 API 없이 목록 데이터로 직접 집계
  const stats = useMemo(() => {
    const countByRole = (role) => users.filter((u) => u.role === role).length;
    return [
      { icon: '👤', label: '전체 이용자', value: users.length },
      { icon: '🛡️', label: '관리자', value: countByRole('관리자') },
      // TODO: role 값 체계(관제자/차주 등) 확정되면 아래 라벨/카운트 기준 재확인
      { icon: '📡', label: '관제자', value: countByRole('관제자') },
      { icon: '🚚', label: '회원 (차주)', value: countByRole('차주') },
    ];
  }, [users]);

  // 권한 문자열(JSON) → 객체로 안전하게 파싱
  const parsePermissions = (permissionsStr) => {
    if (!permissionsStr) return {};
    try {
      return JSON.parse(permissionsStr);
    } catch {
      console.warn('permissions 파싱 실패, 빈 객체로 대체:', permissionsStr);
      return {};
    }
  };

  // 필터(전체/관리자/관제자/차주) + 검색어(이름/이메일)를 함께 적용
  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const matchesFilter = activeFilter === '전체' || user.role === activeFilter;
      const matchesSearch =
        keyword === '' ||
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm, users]);

  // 필터/검색어가 바뀌면 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  // 전체 페이지 수 (최소 1페이지)
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  // 현재 페이지에 해당하는 사용자만 잘라내기
  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  // 저장 시 실제 API 호출 → 성공하면 훅이 목록을 알아서 다시 불러옴
  const handleSavePermissions = async (updated) => {
    try {
      const payload = {
        ...updated,
        permissions: JSON.stringify(updated.permissions ?? {}),
      };
      await updateUserMutation.mutateAsync({ userId: updated.userId, payload });
    } catch (err) {
      console.error('권한 저장 실패:', err);
    } finally {
      setSelectedUser(null);
    }
  };

  // 회원 탈퇴 처리
  const handleDeleteUser = async (targetUser) => {
    try {
      await deleteUserMutation.mutateAsync(targetUser.userId);
      setSelectedUser(null);
      alert('회원 탈퇴 처리가 완료되었습니다.');
    } catch (err) {
      console.error('회원 탈퇴 실패:', err);
      alert('회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 비밀번호 재설정 링크 전송
  // TODO: 백엔드에 POST /api/users/{userId}/password-reset 없음 — 추가되기 전까지 404
  const handleResetPassword = async (targetUser) => {
    try {
      await resetPasswordMutation.mutateAsync(targetUser.userId);
      alert('비밀번호 재설정 링크를 전송했습니다.');
    } catch (err) {
      console.error('재설정 링크 전송 실패:', err);
      alert('재설정 링크 전송에 실패했습니다. 백엔드 API가 아직 준비되지 않았을 수 있습니다.');
    }
  };

  return (
    <div className="user-management-page">
      <h2>이용자 관리</h2>

      {/* 통계 카드 그리드 */}
      <div className="stat-grid">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* 검색 및 필터 영역 */}
      <SearchFilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={(e) => e.preventDefault()}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isLoading ? (
        <div className="user-management-status">불러오는 중...</div>
      ) : error ? (
        <div className="user-management-status user-management-status--error">
          회원 목록을 불러오지 못했습니다.
        </div>
      ) : (
        <>
          {/* 사용자 목록 테이블 카드 */}
          <UserTable
            users={pagedUsers}
            onManageRole={(user) =>
              setSelectedUser({ ...user, permissions: parsePermissions(user.permissions) })
            }
          />

          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* 권한 관리 모달 */}
      {selectedUser && (
        <UserPermissionModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSavePermissions}
          onResetPassword={handleResetPassword}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
}