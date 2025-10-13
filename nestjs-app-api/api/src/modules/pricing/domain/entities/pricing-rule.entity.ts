import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../../shared/kernel';

/**
 * PricingRule Entity
 * 
 * Represents a pricing rule that can be applied to calculate prices.
 * Rules can be based on various criteria like customer type, quantity, date ranges, etc.
 */
@Entity('pricing_rules')
@Index(['isActive', 'priority'])
@Index(['ruleType', 'isActive'])
export class PricingRule extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ 
    type: 'enum', 
    enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'QUANTITY_BREAK', 'CUSTOMER_TYPE', 'DATE_RANGE', 'COMPOSITE'],
    default: 'PERCENTAGE'
  })
  ruleType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'QUANTITY_BREAK' | 'CUSTOMER_TYPE' | 'DATE_RANGE' | 'COMPOSITE';

  @Column({ type: 'json' })
  conditions: {
    customerType?: string[];
    minQuantity?: number;
    maxQuantity?: number;
    startDate?: Date;
    endDate?: Date;
    productCategories?: string[];
    regions?: string[];
    [key: string]: any;
  };

  @Column({ type: 'json' })
  actions: {
    type: 'DISCOUNT' | 'MARKUP' | 'SET_PRICE' | 'FREE_SHIPPING';
    value: number;
    maxDiscount?: number;
    minOrderValue?: number;
    [key: string]: any;
  };

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  validFrom: Date;

  @Column({ type: 'date', nullable: true })
  validUntil: Date;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
