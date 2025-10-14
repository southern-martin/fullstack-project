import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("price_calculations")
@Index(["requestId"], { unique: true })
@Index(["calculatedAt"])
@Index(["createdAt"])
export class PriceCalculationTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column({ unique: true, length: 255 })
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
