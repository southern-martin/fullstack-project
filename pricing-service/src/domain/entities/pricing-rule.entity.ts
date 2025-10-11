import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("pricing_rules")
export class PricingRule {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column({ nullable: true })
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
