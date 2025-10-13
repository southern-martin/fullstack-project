import { DomainEvent } from '../../../../shared/kernel';
import { PriceCalculation } from '../entities/price-calculation.entity';

/**
 * PriceCalculatedEvent
 * 
 * This event is raised when a price calculation is completed.
 * It contains the calculation details and can be used for analytics, auditing, etc.
 */
export class PriceCalculatedEvent extends DomainEvent {
  constructor(
    public readonly priceCalculation: PriceCalculation,
    public readonly calculatedAt: Date = new Date()
  ) {
    super();
  }

  getEventName(): string {
    return 'PriceCalculated';
  }

  getAggregateId(): string {
    return this.priceCalculation.requestId;
  }

  getEventData(): any {
    return {
      requestId: this.priceCalculation.requestId,
      basePrice: this.priceCalculation.basePrice,
      finalPrice: this.priceCalculation.finalPrice,
      totalDiscount: this.priceCalculation.totalDiscount,
      totalMarkup: this.priceCalculation.totalMarkup,
      customerId: this.priceCalculation.inputData.customerId,
      productId: this.priceCalculation.inputData.productId,
      quantity: this.priceCalculation.inputData.quantity,
      appliedRulesCount: this.priceCalculation.appliedRules.length,
      calculationTimeMs: this.priceCalculation.calculationTimeMs,
      isCached: this.priceCalculation.isCached,
      calculatedAt: this.calculatedAt,
    };
  }
}
