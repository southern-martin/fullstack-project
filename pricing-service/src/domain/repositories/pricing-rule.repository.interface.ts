import { PaginationDto } from "@shared/infrastructure";
import { PricingRule } from "../entities/pricing-rule.entity";

export interface PricingRuleRepositoryInterface {
  create(pricingRule: PricingRule): Promise<PricingRule>;
  findById(id: number): Promise<PricingRule | null>;
  findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ pricingRules: PricingRule[]; total: number }>;
  search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ pricingRules: PricingRule[]; total: number }>;
  update(id: number, pricingRule: Partial<PricingRule>): Promise<PricingRule>;
  delete(id: number): Promise<void>;
  findActive(): Promise<PricingRule[]>;
  findByConditions(conditions: any): Promise<PricingRule[]>;
  count(): Promise<number>;
  countActive(): Promise<number>;
  findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ pricingRules: PricingRule[]; total: number }>;
}
