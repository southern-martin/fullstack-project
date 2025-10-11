import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("languages")
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true, length: 5 })
  code: string; // e.g., 'en', 'fr', 'es'

  @Column()
  name: string; // e.g., 'English', 'French', 'Spanish'

  @Column({ nullable: true })
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







