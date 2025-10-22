/**
 * Dashboard Labels Translation Hook
 * 
 * Provides translated labels for the Dashboard module using the generic useLabels hook.
 * Supports English, French, and Spanish translations with automatic batching and caching.
 */

import { useLabels } from '../../../shared/hooks/useLabels';
import { dashboardLabels } from '../labels/dashboard-labels';

/**
 * Custom hook for Dashboard module translations
 * 
 * @returns Translated dashboard labels based on current language
 * 
 * @example
 * ```tsx
 * const L = useDashboardLabels();
 * <h1>{L.PAGE_TITLE}</h1>
 * ```
 */
export const useDashboardLabels = () => {
  return useLabels(dashboardLabels, 'dashboard');
};
