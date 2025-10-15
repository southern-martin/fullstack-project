import { useCallback, useEffect, useState } from 'react';
import { PaginatedResponse, PaginationParams } from '../types';

export interface UseServerPaginationOptions<T> {
  fetchFunction: (params: PaginationParams) => Promise<PaginatedResponse<T>>;
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: string;
  initialSortBy?: string;
  initialSortOrder?: 'asc' | 'desc';
  autoFetch?: boolean;
}

export interface UseServerPaginationReturn<T> {
  // Data
  data: T[];
  loading: boolean;
  error: string | null;

  // Pagination state
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;

  // Search and sorting
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  // Actions
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  refresh: () => void;
  reset: () => void;
}

export function useServerPagination<T = any>({
  fetchFunction,
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = '',
  initialSortBy = '',
  initialSortOrder = 'asc',
  autoFetch = true,
}: UseServerPaginationOptions<T>): UseServerPaginationReturn<T> {
  // State
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search and sorting state
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  // Computed values
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const startIndex = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, total);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: PaginationParams = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        sortBy: sortBy || undefined,
        sortOrder,
      };

      const response = await fetchFunction(params);

      setData(response.data || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      setData([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, currentPage, pageSize, searchTerm, sortBy, sortOrder]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  // Actions
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);
      }
    },
    [currentPage, totalPages]
  );

  const changePageSize = useCallback(
    (size: number) => {
      if (size !== pageSize) {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when changing page size
      }
    },
    [pageSize]
  );

  const setSearch = useCallback(
    (search: string) => {
      if (search !== searchTerm) {
        setSearchTerm(search);
        setCurrentPage(1); // Reset to first page when searching
      }
    },
    [searchTerm]
  );

  const setSorting = useCallback(
    (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      if (newSortBy !== sortBy || newSortOrder !== sortOrder) {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(1); // Reset to first page when sorting
      }
    },
    [sortBy, sortOrder]
  );

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setSearchTerm(initialSearch);
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
    setError(null);
  }, [
    initialPage,
    initialPageSize,
    initialSearch,
    initialSortBy,
    initialSortOrder,
  ]);

  return {
    // Data
    data,
    loading,
    error,

    // Pagination state
    currentPage,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,

    // Search and sorting
    searchTerm,
    sortBy,
    sortOrder,

    // Actions
    goToPage,
    changePageSize,
    setSearch,
    setSorting,
    refresh,
    reset,
  };
}
