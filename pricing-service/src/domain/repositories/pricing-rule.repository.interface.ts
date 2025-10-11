import { PricingRule } from "../entities/pricing-rule.entity";

export interface PricingRuleRepositoryInterface {
  create(pricingRule: PricingRule): Promise<PricingRule>;
  findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ pricingRules: PricingRule[]; total: number }>;
  findById(id: number): Promise<PricingRule | null>;
  findActive(): Promise<PricingRule[]>;
  findByConditions(conditions: any): Promise<PricingRule[]>;
  update(id: number, pricingRule: Partial<PricingRule>): Promise<PricingRule>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
}







