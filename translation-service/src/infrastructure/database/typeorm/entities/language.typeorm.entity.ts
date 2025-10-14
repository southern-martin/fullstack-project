import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("languages")
@Index(["code"], { unique: true })
@Index(["isActive"])
@Index(["isDefault"])
@Index(["createdAt"])
export class LanguageTypeOrmEntity {
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

  @Column({ unique: true, length: 5 })
  code: string; // e.g., 'en', 'fr', 'es'

  @Column({ length: 100 })
  name: string; // e.g., 'English', 'French', 'Spanish'

  @Column({ nullable: true, length: 100 })
  nativeName: string; // e.g., 'English', 'Français', 'Español'

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: "json", nullable: true })
  metadata: {
    flag?: string; // Flag emoji or URL
    direction?: "ltr" | "rtl"; // Text direction
    region?: string; // e.g., 'US', 'FR', 'ES'
    currency?: string; // e.g., 'USD', 'EUR'
    dateFormat?: string; // e.g., 'MM/DD/YYYY', 'DD/MM/YYYY'
  };
}
