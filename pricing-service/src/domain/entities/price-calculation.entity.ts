import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("price_calculations")
export class PriceCalculation {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  requestId: string;

  @Column({ type: "json" })
  request: {
    carrierId: number;
    serviceType: string;
    weight: number;
    distance?: number;
    originCountry: string;
    destinationCountry: string;
    customerType?: string;
    customerId?: number;
  };

  @Column({ type: "json" })
  calculation: {
    baseRate: number;
    weightRate: number;
    distanceRate?: number;
    surcharges: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
    discounts: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
    subtotal: number;
    total: number;
    currency: string;
  };

  @Column({ type: "json", nullable: true })
  appliedRules: Array<{
    ruleId: number;
    ruleName: string;
    priority: number;
  }>;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  calculatedAt: Date;
}





