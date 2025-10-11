import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTableContext } from '../components/TableProvider';

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean' | 'multiselect';
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  multiple?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface UseTableFiltersOptions {
  filters: FilterOption[];
  debounceMs?: number;
  onFilterChange?: (filters: Record<string, any>) => void;
  onSearchChange?: (searchTerm: string) => void;
  initialFilters?: Record<string, any>;
  initialSearch?: string;
}

export interface UseTableFiltersReturn {
  // Filter state
  searchTerm: string;
  filters: Record<string, any>;
  activeFilters: string[];
  filterCount: number;

  // Filter actions
  setSearchTerm: (term: string) => void;
  setFilter: (key: string, value: any) => void;
  clearFilter: (key: string) => void;
  clearAllFilters: () => void;
  resetFilters: () => void;

  // Filter utilities
  hasActiveFilters: boolean;
  getFilterValue: (key: string) => any;
  isFilterActive: (key: string) => boolean;

  // Filter options
  filterOptions: FilterOption[];
}

export const useTableFilters = (
  options: UseTableFiltersOptions
): UseTableFiltersReturn => {
  const {
    filters: filterOptions,
    debounceMs = 300,
    onFilterChange,
    onSearchChange,
    initialFilters = {},
    initialSearch = '',
  } = options;

  const { state, actions } = useTableContext();
  const [searchTerm, setSearchTermState] = useState(initialSearch);
  const [filters, setFiltersState] = useState(initialFilters);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Debounced search
  const debouncedSetSearch = useCallback(
    (term: string) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        actions.handleSearch(term);
        onSearchChange?.(term);
      }, debounceMs);

      setDebounceTimer(timer);
    },
    [debounceTimer, debounceMs, actions, onSearchChange]
  );

  // Set search term
  const setSearchTerm = useCallback(
    (term: string) => {
      setSearchTermState(term);
      debouncedSetSearch(term);
    },
    [debouncedSetSearch]
  );

  // Set filter
  const setFilter = useCallback(
    (key: string, value: any) => {
      const newFilters = { ...filters, [key]: value };
      setFiltersState(newFilters);

      // Update table state
      actions.setFiltering({
        columnFilters: newFilters,
      });

      onFilterChange?.(newFilters);
    },
    [filters, actions, onFilterChange]
  );

  // Clear specific filter
  const clearFilter = useCallback(
    (key: string) => {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFiltersState(newFilters);

      // Update table state
      actions.setFiltering({
        columnFilters: newFilters,
      });

      onFilterChange?.(newFilters);
    },
    [filters, actions, onFilterChange]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFiltersState({});
    setSearchTermState('');

    // Update table state
    actions.setFiltering({
      searchTerm: '',
      columnFilters: {},
    });

    onFilterChange?.({});
    onSearchChange?.('');
  }, [actions, onFilterChange, onSearchChange]);

  // Reset filters to initial state
  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    setSearchTermState(initialSearch);

    // Update table state
    actions.setFiltering({
      searchTerm: initialSearch,
      columnFilters: initialFilters,
    });

    onFilterChange?.(initialFilters);
    onSearchChange?.(initialSearch);
  }, [initialFilters, initialSearch, actions, onFilterChange, onSearchChange]);

  // Get filter value
  const getFilterValue = useCallback(
    (key: string) => {
      return filters[key];
    },
    [filters]
  );

  // Check if filter is active
  const isFilterActive = useCallback(
    (key: string) => {
      const value = filters[key];
      if (value === undefined || value === null) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim().length > 0;
      return true;
    },
    [filters]
  );

  // Active filters
  const activeFilters = useMemo(() => {
    return Object.keys(filters).filter(key => isFilterActive(key));
  }, [filters, isFilterActive]);

  // Filter count
  const filterCount = useMemo(() => {
    return activeFilters.length + (searchTerm ? 1 : 0);
  }, [activeFilters.length, searchTerm]);

  // Has active filters
  const hasActiveFilters = useMemo(() => {
    return filterCount > 0;
  }, [filterCount]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Sync with table state
  useEffect(() => {
    const tableSearchTerm = state.filtering.searchTerm;
    const tableFilters = state.filtering.columnFilters;

    if (tableSearchTerm !== searchTerm) {
      setSearchTermState(tableSearchTerm);
    }

    if (JSON.stringify(tableFilters) !== JSON.stringify(filters)) {
      setFiltersState(tableFilters);
    }
  }, [state.filtering, searchTerm, filters]);

  return {
    searchTerm,
    filters,
    activeFilters,
    filterCount,
    setSearchTerm,
    setFilter,
    clearFilter,
    clearAllFilters,
    resetFilters,
    hasActiveFilters,
    getFilterValue,
    isFilterActive,
    filterOptions,
  };
};

