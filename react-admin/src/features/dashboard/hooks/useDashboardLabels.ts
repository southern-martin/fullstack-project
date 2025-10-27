import { useLabels } from '../../../shared/hooks/useLabels';
import { DashboardLabels, dashboardLabels } from '../labels/dashboard-labels';

/**
 * Dashboard Module Labels Hook
 * 
 * Provides translated labels for the Dashboard module.
 * Wraps the generic useLabels hook with module-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full DashboardLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = useDashboardLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <button>{L.buttons.retry}</button>
 *     <p>{L.messages.success}</p>
 *   </div>
 * );
 */
export const useDashboardLabels = () => {
  const result = useLabels<DashboardLabels>(dashboardLabels, 'dashboard');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
