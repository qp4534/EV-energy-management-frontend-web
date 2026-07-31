import React, { useState } from 'react';
import StatCard from '../../components/administrator/main/StatCard';
import SearchFilterSection from '../../components/administrator/user/SearchFilterSection';
import UserTable from '../../components/administrator/user/UserTable';
import UserPermissionModal from '../../components/administrator/user/UserPermissionModal';
import '../../styles/administrator/UserManage.css';

export default function UserManage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('전체');
  const [selectedUser, setSelectedUser] = useState(null); // 추가: 권한 관리 모달 대상

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

  // 저장 시 처리 (지금은 mock 배열만 갱신, 나중에 API 연동 시 여기 교체)
  const handleSavePermissions = (updated) => {
    console.log('저장된 권한:', updated);
    setSelectedUser(null);
  };

  return (
    <div className="user-management-page">
      <h1>이용자 관리</h1>

      {/* 카드 1: 통계 카드 그리드 */}
      <div className="stat-grid">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* 카드 2: 검색 및 필터 영역 */}
      <SearchFilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={(e) => e.preventDefault()}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* 카드 3: 사용자 목록 테이블 카드 */}
      <UserTable users={users} onManageRole={setSelectedUser} />

      {/* 추가: 권한 관리 모달 */}
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