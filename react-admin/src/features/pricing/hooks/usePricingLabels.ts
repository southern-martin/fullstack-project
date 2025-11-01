import { useLabels } from '../../../shared/hooks/useLabels';
import { PricingLabels, pricingLabels } from '../labels/pricing-labels';

/**
 * Pricing Module Labels Hook
 * 
 * Provides translated labels for the Pricing module.
 * Wraps the generic useLabels hook with module-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full PricingLabels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = usePricingLabels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <button>{L.buttons.create}</button>
 *   </div>
 * );
 */
export const usePricingLabels = () => {
  const result = useLabels<PricingLabels>(pricingLabels, 'pricing');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
