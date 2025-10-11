import { useCallback, useEffect, useState } from 'react';
import { useTableContext } from '../components/TableProvider';

export interface UseTableDataOptions<T = any> {
  fetchData?: (params?: any) => Promise<T[]>;
  initialData?: T[];
  autoFetch?: boolean;
  cacheKey?: string;
  staleTime?: number; // in milliseconds
  refetchOnWindowFocus?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: T[]) => void;
}

export interface UseTableDataReturn<T = any> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: (params?: any) => Promise<void>;
  invalidate: () => void;
  isStale: boolean;
  lastFetched: Date | null;
}

export const useTableData = <T = any>(
  options: UseTableDataOptions<T> = {}
): UseTableDataReturn<T> => {
  const {
    fetchData,
    initialData = [],
    autoFetch = true,
    cacheKey,
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = true,
    onError,
    onSuccess,
  } = options;

  const { state, actions } = useTableContext<T>();
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [isStale, setIsStale] = useState(false);

  // Check if data is stale
  useEffect(() => {
    if (lastFetched) {
      const now = new Date();
      const timeDiff = now.getTime() - lastFetched.getTime();
      setIsStale(timeDiff > staleTime);
    }
  }, [lastFetched, staleTime]);

  // Handle window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus || !fetchData) return;

    const handleFocus = () => {
      if (isStale) {
        refetch();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, fetchData, isStale]);

  // Fetch data function
  const refetch = useCallback(
    async (params?: any) => {
      if (!fetchData) return;

      try {
        actions.setLoading(true);
        actions.setError(undefined);

        const data = await fetchData(params);

        actions.setData(data);
        setLastFetched(new Date());
        setIsStale(false);

        onSuccess?.(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch data';
        actions.setError(errorMessage);
        onError?.(error as Error);
      } finally {
        actions.setLoading(false);
      }
    },
    [fetchData, actions, onSuccess, onError]
  );

  // Invalidate cache
  const invalidate = useCallback(() => {
    setIsStale(true);
    if (cacheKey) {
      // Clear from localStorage cache if using cache
      localStorage.removeItem(`table_cache_${cacheKey}`);
    }
  }, [cacheKey]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && fetchData) {
      refetch();
    } else if (initialData.length > 0) {
      actions.setData(initialData);
    }
  }, [autoFetch, fetchData, initialData, actions, refetch]);

  return {
    data: (state.data as any).data,
    loading: (state.data as any).loading,
    error: (state.data as any).error,
    refetch,
    invalidate,
    isStale,
    lastFetched,
  };
};
