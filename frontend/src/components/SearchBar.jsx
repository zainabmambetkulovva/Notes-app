import React from 'react';
import './SearchBar.css';

function SearchBar({ searchQuery, onSearchChange, sortBy, onSortChange }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по заметкам..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="clear-search"
            onClick={() => onSearchChange('')}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>

      <div className="sort-wrapper">
        <label htmlFor="sort-select">Сортировка:</label>
        <select
          id="sort-select"
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="updatedAt">По дате изменения</option>
          <option value="createdAt">По дате создания</option>
          <option value="title">По заголовку</option>
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
