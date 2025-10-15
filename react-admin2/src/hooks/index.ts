// Enterprise-grade custom hooks for business logic separation

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ApiResponse, 
  PaginationMeta, 
  QueryParams,
  User,
  Product,
  Order,
  Customer
} from '../types';
import { 
  IUseApiOptions, 
  IUseApiResult, 
  IUsePaginationOptions, 
  IUsePaginationResult 
} from '../interfaces';

// Generic API hook for data fetching
export const useApi = <T = any>(
  queryKey: string[],
  queryFn: () => Promise<ApiResponse<T>>,
  options: IUseApiOptions<T> = {}
): IUseApiResult<T> => {
  const {
    immediate = true,
    onSuccess,
    onError,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!immediate) return;

    setLoading(true);
    setError(null);

    try {
      const response = await queryFn();
      if (response.success) {
        setData(response.data);
        onSuccess?.(response.data);
      } else {
        throw new Error(response.message || 'API request failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [queryFn, immediate, onSuccess, onError]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    mutate,
  };
};

// Pagination hook
export const usePagination = (options: IUsePaginationOptions = {}): IUsePaginationResult => {
  const {
    initialPage = 1,
    initialLimit = 10,
    total = 0,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);
  const hasNext = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPrev = useMemo(() => page > 1, [page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNext) {
      setPage(prev => prev + 1);
    }
  }, [hasNext]);

  const prevPage = useCallback(() => {
    if (hasPrev) {
      setPage(prev => prev - 1);
    }
  }, [hasPrev]);

  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    goToPage,
    nextPage,
    prevPage,
    setLimit: updateLimit,
  };
};

// Debounced value hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Local storage hook
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// Session storage hook
export const useSessionStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// Previous value hook
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Click outside hook
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

// Intersection observer hook
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
};

// Media query hook
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Copy to clipboard hook
export const useCopyToClipboard = (): [boolean, (text: string) => Promise<void>] => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  }, []);

  return [copied, copyToClipboard];
};

// Online status hook
export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Window size hook
export const useWindowSize = (): { width: number; height: number } => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Form validation hook
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, any>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback((field: keyof T) => {
    const rules = validationRules[field];
    if (!rules) return true;

    const value = values[field];
    const error = rules.validate(value, values);
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  }, [values, validationRules]);

  const validateForm = useCallback(() => {
    const newErrors = {} as Record<keyof T, string>;
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const fieldKey = field as keyof T;
      const rules = validationRules[fieldKey];
      if (rules) {
        const error = rules.validate(values[fieldKey], values);
        if (error) {
          newErrors[fieldKey] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string>);
    setTouched({} as Record<keyof T, boolean>);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0,
  };
};

// Business logic hooks for specific entities
export const useUsers = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      // Implementation would call actual API
      const response = await fetch('/api/users');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProducts = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      // Implementation would call actual API
      const response = await fetch('/api/products');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrders = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      // Implementation would call actual API
      const response = await fetch('/api/orders');
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCustomers = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      // Implementation would call actual API
      const response = await fetch('/api/customers');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hooks for data modification
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Export all hooks
export default {
  useApi,
  usePagination,
  useDebounce,
  useLocalStorage,
  useSessionStorage,
  usePrevious,
  useClickOutside,
  useIntersectionObserver,
  useMediaQuery,
  useCopyToClipboard,
  useOnlineStatus,
  useWindowSize,
  useFormValidation,
  useUsers,
  useProducts,
  useOrders,
  useCustomers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
};
