import { DomainEvent } from '../../../../shared/kernel';
import { PricingRule } from '../entities/pricing-rule.entity';

/**
 * PricingRuleCreatedEvent
 * 
 * This event is raised when a new pricing rule is created in the system.
 * It contains all the relevant information about the newly created pricing rule.
 */
export class PricingRuleCreatedEvent extends DomainEvent {
  constructor(
    public readonly pricingRule: PricingRule,
    public readonly createdAt: Date = new Date()
  ) {
    super();
  }

  getEventName(): string {
    return 'PricingRuleCreated';
  }

  getAggregateId(): string {
    return this.pricingRule.id.toString();
  }

  getEventData(): any {
    return {
      ruleId: this.pricingRule.id,
      name: this.pricingRule.name,
      ruleType: this.pricingRule.ruleType,
      priority: this.pricingRule.priority,
      isActive: this.pricingRule.isActive,
      validFrom: this.pricingRule.validFrom,
      validUntil: this.pricingRule.validUntil,
      conditions: this.pricingRule.conditions,
      actions: this.pricingRule.actions,
      createdAt: this.createdAt,
    };
  }
}
