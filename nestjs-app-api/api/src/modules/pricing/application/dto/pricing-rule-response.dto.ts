import { PricingRule } from '../../domain/entities/pricing-rule.entity';

export class PricingRuleResponseDto {
  id: number;
  name: string;
  description: string;
  ruleType: string;
  conditions: any;
  actions: any;
  priority: number;
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(pricingRule: PricingRule): PricingRuleResponseDto {
    const dto = new PricingRuleResponseDto();
    dto.id = pricingRule.id;
    dto.name = pricingRule.name;
    dto.description = pricingRule.description;
    dto.ruleType = pricingRule.ruleType;
    dto.conditions = pricingRule.conditions;
    dto.actions = pricingRule.actions;
    dto.priority = pricingRule.priority;
    dto.isActive = pricingRule.isActive;
    dto.validFrom = pricingRule.validFrom;
    dto.validUntil = pricingRule.validUntil;
    dto.metadata = pricingRule.metadata;
    dto.createdAt = pricingRule.createdAt;
    dto.updatedAt = pricingRule.updatedAt;
    return dto;
  }
}
