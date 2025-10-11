import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("carriers")
export class Carrier {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ type: "json", nullable: true })
  metadata: {
    code?: string;
    website?: string;
    trackingUrl?: string;
    serviceTypes?: string[];
    coverage?: string[];
    pricing?: {
      baseRate?: number;
      currency?: string;
      perKgRate?: number;
    };
  };
}




