import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("pricing_rules")
@Index(["name"])
@Index(["isActive"])
@Index(["priority"])
@Index(["validFrom", "validTo"])
@Index(["createdAt"])
export class PricingRuleTypeOrmEntity {
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

  @Column({ length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "json" })
  conditions: {
    carrierId?: number;
    serviceType?: string;
    weightRange?: {
      min: number;
      max: number;
    };
    distanceRange?: {
      min: number;
      max: number;
    };
    originCountry?: string;
    destinationCountry?: string;
    customerType?: string;
  };

  @Column({ type: "json" })
  pricing: {
    baseRate: number;
    currency: string;
    perKgRate?: number;
    perKmRate?: number;
    minimumCharge?: number;
    maximumCharge?: number;
    surcharges?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
    discounts?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
  };

  @Column({ type: "int", default: 0 })
  priority: number;

  @Column({ type: "date", nullable: true })
  validFrom: Date;

  @Column({ type: "date", nullable: true })
  validTo: Date;
}
