import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LanguageTypeOrmEntity } from "./language.typeorm.entity";

@Entity("language_values")
@Index(["languageCode"])
@Index(["isApproved"])
@Index(["createdAt"])
@Index(["usageCount"])
export class LanguageValueTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true, length: 32 })
  key: string; // MD5 hash of the original text

  @Column({ length: 5 })
  languageCode: string; // Language code reference (e.g., 'en', 'es', 'fr') - matches old system

  @ManyToOne(() => LanguageTypeOrmEntity)
  @JoinColumn({ name: "languageCode", referencedColumnName: "code" })
  language: LanguageTypeOrmEntity;

  @Column({ type: "text" })
  original: string; // Original text in source language (renamed from originalText to match old system)

  @Column({ type: "text" })
  destination: string; // Translated text (renamed from translatedText to match old system)

  @Column({ type: "json", nullable: true })
  context: {
    category?: string; // e.g., 'ui', 'content', 'error'
    module?: string; // e.g., 'auth', 'user', 'carrier'
    component?: string; // e.g., 'button', 'form', 'table'
    field?: string; // e.g., 'email', 'password', 'name'
  };

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true, length: 50 })
  approvedBy: string; // User ID who approved the translation

  @Column({ type: "timestamp", nullable: true })
  approvedAt: Date;

  @Column({ default: 0 })
  usageCount: number; // How many times this translation has been used

  @Column({ type: "timestamp", nullable: true })
  lastUsedAt: Date;
}
