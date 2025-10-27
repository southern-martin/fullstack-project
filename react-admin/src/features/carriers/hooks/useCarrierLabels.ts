import { useLabels } from '../../../shared/hooks/useLabels';
import { CarrierLabels, carrierLabels } from '../labels/carrier-labels';

/**
 * Carrier Module Labels Hook
 * 
 * Provides translated labels for the Carrier module.
 * Wraps the generic useLabels hook with module-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full CarrierLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = useCarrierLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <button>{L.actions.add}</button>
 *     <p>{L.messages.createSuccess}</p>
 *   </div>
 * );
 */
export const useCarrierLabels = () => {
  const result = useLabels<CarrierLabels>(carrierLabels, 'carrier');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
