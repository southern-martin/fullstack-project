import { PricingRule } from '../entities/pricing-rule.entity';
import { PaginationDto } from '../../../../shared/dto';

/**
 * PricingRuleRepositoryInterface
 * 
 * This interface defines the contract for pricing rule data access operations.
 * It abstracts the data persistence layer and allows for different implementations
 * without affecting the business logic.
 */
export interface PricingRuleRepositoryInterface {
  /**
   * Creates a new pricing rule in the repository.
   * @param pricingRule The pricing rule entity to create.
   * @returns Promise<PricingRule> The created pricing rule with generated ID.
   */
  create(pricingRule: PricingRule): Promise<PricingRule>;

  /**
   * Finds a pricing rule by its ID.
   * @param id The pricing rule ID.
   * @returns Promise<PricingRule | null> The pricing rule if found, null otherwise.
   */
  findById(id: number): Promise<PricingRule | null>;

  /**
   * Finds all pricing rules with pagination.
   * @param paginationDto Pagination parameters.
   * @returns Promise<{ pricingRules: PricingRule[]; total: number }> Paginated pricing rules and total count.
   */
  findAll(paginationDto: PaginationDto): Promise<{ pricingRules: PricingRule[]; total: number }>;

  /**
   * Finds all active pricing rules.
   * @returns Promise<PricingRule[]> Array of active pricing rules.
   */
  findActive(): Promise<PricingRule[]>;

  /**
   * Finds pricing rules by type.
   * @param ruleType The type of pricing rule.
   * @returns Promise<PricingRule[]> Array of pricing rules of the specified type.
   */
  findByType(ruleType: string): Promise<PricingRule[]>;

  /**
   * Finds pricing rules that are applicable for given input data.
   * @param inputData Input data for rule evaluation.
   * @returns Promise<PricingRule[]> Array of applicable pricing rules.
   */
  findApplicable(inputData: any): Promise<PricingRule[]>;

  /**
   * Searches pricing rules by search criteria.
   * @param searchTerm Search term to match against name or description.
   * @param paginationDto Pagination parameters.
   * @returns Promise<{ pricingRules: PricingRule[]; total: number }> Paginated search results.
   */
  search(searchTerm: string, paginationDto: PaginationDto): Promise<{ pricingRules: PricingRule[]; total: number }>;

  /**
   * Updates an existing pricing rule.
   * @param id The pricing rule ID.
   * @param pricingRule Partial pricing rule data to update.
   * @returns Promise<PricingRule> The updated pricing rule.
   */
  update(id: number, pricingRule: Partial<PricingRule>): Promise<PricingRule>;

  /**
   * Deletes a pricing rule by ID.
   * @param id The pricing rule ID.
   * @returns Promise<void>
   */
  delete(id: number): Promise<void>;

  /**
   * Gets the total count of pricing rules.
   * @returns Promise<number> Total number of pricing rules.
   */
  count(): Promise<number>;

  /**
   * Gets the count of active pricing rules.
   * @returns Promise<number> Number of active pricing rules.
   */
  countActive(): Promise<number>;

  /**
   * Finds pricing rules by date range.
   * @param startDate Start date for the range.
   * @param endDate End date for the range.
   * @returns Promise<PricingRule[]> Pricing rules valid within the date range.
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<PricingRule[]>;

  /**
   * Finds pricing rules by priority range.
   * @param minPriority Minimum priority value.
   * @param maxPriority Maximum priority value.
   * @returns Promise<PricingRule[]> Pricing rules within the priority range.
   */
  findByPriorityRange(minPriority: number, maxPriority: number): Promise<PricingRule[]>;
}
