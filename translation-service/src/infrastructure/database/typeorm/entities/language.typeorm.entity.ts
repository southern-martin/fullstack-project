import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from "typeorm";

@Entity("languages")
@Index(["status"])
@Index(["isDefault"])
@Index(["createdAt"])
export class LanguageTypeOrmEntity {
  @Column({ primary: true, unique: true, length: 5 })
  code: string; // e.g., 'en', 'fr', 'es' - PRIMARY KEY

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 100 })
  name: string; // e.g., 'English', 'French', 'Spanish'

  @Column({ nullable: true, length: 100 })
  localName: string; // e.g., 'English', 'Français', 'Español' (renamed from nativeName to match old system)

  @Column({ nullable: true, length: 10 })
  flag: string; // Flag emoji or URL (extracted from metadata to match old system)

  @Column({ length: 20, default: "active" })
  status: string; // 'active' or 'inactive' (renamed from isActive to match old system)

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: "json", nullable: true })
  metadata: {
    direction?: "ltr" | "rtl"; // Text direction
    region?: string; // e.g., 'US', 'FR', 'ES'
    currency?: string; // e.g., 'USD', 'EUR'
    dateFormat?: string; // e.g., 'MM/DD/YYYY', 'DD/MM/YYYY'
  };
}
