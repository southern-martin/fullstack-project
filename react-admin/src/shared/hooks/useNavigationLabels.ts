import { useLabels } from '../hooks/useLabels';
import { NavigationLabels, navigationLabels } from '../labels/navigation-labels';

/**
 * Navigation Labels Hook
 * 
 * Provides translated labels for the Navigation/Sidebar component.
 * Wraps the generic useLabels hook with navigation-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full NavigationLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = useNavigationLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <nav>
 *     <Link to="/dashboard">{L.menuItems.dashboard}</Link>
 *     <Link to="/users">{L.menuItems.users}</Link>
 *   </nav>
 * );
 */
export const useNavigationLabels = () => {
  const result = useLabels<NavigationLabels>(navigationLabels, 'navigation');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
