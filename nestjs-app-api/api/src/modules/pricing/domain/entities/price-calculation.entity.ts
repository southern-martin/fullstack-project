import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../../shared/kernel';

/**
 * PriceCalculation Entity
 * 
 * Represents a price calculation record that tracks the pricing process
 * and the rules that were applied to arrive at the final price.
 */
@Entity('price_calculations')
@Index(['requestId'])
@Index(['calculatedAt'])
@Index(['customerId', 'calculatedAt'])
export class PriceCalculation extends BaseEntity {
  @Column({ unique: true })
  requestId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalDiscount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalMarkup: number;

  @Column({ type: 'json' })
  inputData: {
    customerId?: number;
    customerType?: string;
    productId?: number;
    productCategory?: string;
    quantity: number;
    region?: string;
    orderValue?: number;
    [key: string]: any;
  };

  @Column({ type: 'json' })
  appliedRules: Array<{
    ruleId: number;
    ruleName: string;
    ruleType: string;
    discountAmount: number;
    markupAmount: number;
    priority: number;
  }>;

  @Column({ type: 'json', nullable: true })
  calculationSteps: Array<{
    step: string;
    description: string;
    value: number;
    timestamp: Date;
  }>;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  calculationTimeMs: number;

  @Column({ default: false })
  isCached: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  calculatedAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
