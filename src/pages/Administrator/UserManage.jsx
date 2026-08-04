import React, { useState, useMemo, useEffect } from 'react';
import StatCard from '../../components/administrator/main/StatCard';
import SearchFilterSection from '../../components/administrator/user/SearchFilterSection';
import UserTable from '../../components/administrator/user/UserTable';
import UserPermissionModal from '../../components/administrator/user/UserPermissionModal';
import Pagination from '../../components/common/Pagination';
import '../../styles/administrator/UserManage.css';

const PAGE_SIZE = 10; // 페이지당 표시할 회원 수

export default function UserManage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');
  const [selectedUser, setSelectedUser] = useState(null); // 추가: 권한 관리 모달 대상
  const [currentPage, setCurrentPage] = useState(1); // 추가: 현재 페이지

  // 통계 데이터
  const stats = [
    { icon: '👤', label: '전체 이용자', value: 15 },
    { icon: '🛡️', label: '관리자', value: 2 },
    { icon: '📡', label: '관제사', value: 5 },
    { icon: '🚚', label: '회원 (차주)', value: 8 },
  ];

  // 유저 샘플 데이터
  const users = [
    { id: 1, name: '김호두', email: 'hodu1122@nmail.com', role: '관리자', birth: '2026-07-13' },
    { id: 2, name: '박땅콩', email: 'ddangkong@nmail.com', role: '관제사', birth: '2026-07-13' },
    { id: 3, name: '정호랑', email: 'tigerjjang@nmail.com', role: '관제사', birth: '2026-07-13' },
    { id: 4, name: '전고영', email: 'jeongoyung@nmail.com', role: '차주', birth: '2026-07-13' },
    { id: 5, name: '이거북', email: 'thisturtle2@nmail.com', role: '차주', birth: '2026-07-13' },
    { id: 6, name: '박양이', email: 'nyangpark@nmail.com', role: '관제사', birth: '2026-07-13' },
    { id: 7, name: '김곰돌', email: 'kimgomdol@nmail.com', role: '관리자', birth: '2026-07-13' },
    { id: 8, name: '정하얀', email: 'thisturtle2@nmail.com', role: '차주', birth: '2026-07-13' },
    { id: 9, name: '김파랑', email: 'nyangpark@nmail.com', role: '관제사', birth: '2026-07-13' },
    { id: 10, name: '윤초록', email: 'thisturtle2@nmail.com', role: '관제사', birth: '2026-07-13' },
    { id: 11, name: '구주황', email: 'nyangpark@nmail.com', role: '차주', birth: '2026-07-13' },
    { id: 12, name: '강보라', email: 'thisturtle2@nmail.com', role: '차주', birth: '2026-07-13' },
    { id: 13, name: '양노랑', email: 'nyangpark@nmail.com', role: '차주', birth: '2026-07-13' },
    { id: 14, name: '민살구', email: 'thisturtle2@nmail.com', role: '차주', birth: '2026-07-13' },
    { id: 15, name: '박포도', email: 'nyangpark@nmail.com', role: '차주', birth: '2026-07-13' },
  ];

  // 필터(전체/관리자/관제사/차주) + 검색어(이름/이메일)를 함께 적용
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
  }, [activeFilter, searchTerm]);

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

  // 저장 시 처리 (지금은 mock 배열만 갱신, 나중에 API 연동 시 여기 교체)
  const handleSavePermissions = (updated) => {
    console.log('저장된 권한:', updated);
    setSelectedUser(null);
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

      {/* 사용자 목록 테이블 카드 */}
      <UserTable users={pagedUsers} onManageRole={setSelectedUser} />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 권한 관리 모달 */}
      {selectedUser && (
        <UserPermissionModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSavePermissions}
        />
      )}
    </div>
  );
}