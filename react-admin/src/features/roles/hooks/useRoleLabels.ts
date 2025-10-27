import { useLabels } from '../../../shared/hooks/useLabels';
import { RoleLabels, roleLabels } from '../labels/role-labels';

/**
 * Role Module Labels Hook
 * 
 * Provides translated labels for the Role module.
 * Wraps the generic useLabels hook with module-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full RoleLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = useRoleLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <button>{L.buttons.createRole}</button>
 *     <p>{L.messages.createSuccess}</p>
 *   </div>
 * );
 */
export const useRoleLabels = () => {
  const result = useLabels<RoleLabels>(roleLabels, 'role');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
