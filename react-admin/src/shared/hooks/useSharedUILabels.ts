/**
 * Shared UI Labels Translation Hook
 * 
 * This hook provides translated labels for shared UI components.
 * It uses the generic useLabels hook with SharedUILabels type.
 * 
 * Usage:
 * ```tsx
 * const { L, isLoading, error } = useSharedUILabels();
 * 
 * <label>{L.sorting.sortBy}</label>
 * <span>{L.pagination.showing}</span>
 * ```
 * 
 * Features:
 * - Type-safe label access with IntelliSense
 * - Automatic translation via Translation Service
 * - English bypasses API (instant)
 * - React Query caching (5min stale, 10min GC)
 * - Graceful fallback to English on errors
 * 
 * @see useLabels for implementation details
 * @see SHARED_UI_LABELS for label structure
 */

import { SHARED_UI_LABELS, SharedUILabels } from '../constants/shared-ui-labels';
import { useLabels } from './useLabels';

export const useSharedUILabels = () => {
  return useLabels<SharedUILabels>(SHARED_UI_LABELS, 'shared-ui');
};
