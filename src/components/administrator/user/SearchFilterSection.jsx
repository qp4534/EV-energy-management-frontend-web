import React from 'react';
import '../../../styles/administrator/components/SearchFilterSection.css';

export default function SearchFilterSection({ 
  searchTerm, 
  onSearchChange, 
  onSearchSubmit, 
  activeFilter, 
  onFilterChange 
}) {
  const filters = ['전체', '관리자', '관제사', '차주'];

  return (
    <div className="search-bar">
      <form className="search-bar-left" onSubmit={onSearchSubmit}>
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="이름 또는 이메일 검색"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button type="submit" className="search-btn">검색</button>
      </form>

      <div className="filter-tabs">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}