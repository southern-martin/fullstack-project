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
@Index(["key"], { unique: true })
@Index(["languageId"])
@Index(["isApproved"])
@Index(["createdAt"])
@Index(["usageCount"])
export class LanguageValueTypeOrmEntity {
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

  @Column({ unique: true, length: 32 })
  key: string; // MD5 hash of the original text

  @Column({ type: "text" })
  originalText: string; // Original text in source language

  @Column({ type: "text" })
  translatedText: string; // Translated text

  @Column()
  languageId: number;

  @ManyToOne(() => LanguageTypeOrmEntity)
  @JoinColumn({ name: "languageId" })
  language: LanguageTypeOrmEntity;

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
