import React, { memo, useCallback } from 'react';
import type { Filters } from '../types';
import '../styles.css';

interface FiltersPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const FiltersPanel = memo<FiltersPanelProps>(function FiltersPanel({
  filters,
  onFiltersChange,
}) {
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, text: e.target.value });
  }, [filters, onFiltersChange]);

  const handlePriorityChange = useCallback((priority: number | null) => {
    onFiltersChange({ ...filters, priority });
  }, [filters, onFiltersChange]);

  return (
    <div className="filters-panel">
      <input
        type="text"
        placeholder="Filter tasks..."
        value={filters.text}
        onChange={handleTextChange}
        className="filter-input"
      />
      <div className="priority-filters">
        <button 
          className={`priority-btn ${filters.priority === null ? 'active' : ''}`}
          onClick={() => handlePriorityChange(null)}
        >
          All
        </button>
        <button 
          className={`priority-btn ${filters.priority === 1 ? 'active' : ''}`}
          onClick={() => handlePriorityChange(1)}
        >
          Low
        </button>
        <button 
          className={`priority-btn ${filters.priority === 2 ? 'active' : ''}`}
          onClick={() => handlePriorityChange(2)}
        >
          Medium
        </button>
        <button 
          className={`priority-btn ${filters.priority === 3 ? 'active' : ''}`}
          onClick={() => handlePriorityChange(3)}
        >
          High
        </button>
      </div>
    </div>
  );
});
