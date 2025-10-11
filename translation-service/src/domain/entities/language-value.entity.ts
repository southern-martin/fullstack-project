import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Language } from "./language.entity";

@Entity("language_values")
export class LanguageValue {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  key: string; // MD5 hash of the original text

  @Column({ type: "text" })
  originalText: string; // Original text in source language

  @Column({ type: "text" })
  translatedText: string; // Translated text

  @Column()
  languageId: number;

  @ManyToOne(() => Language)
  @JoinColumn({ name: "languageId" })
  language: Language;

  @Column({ type: "json", nullable: true })
  context: {
    category?: string; // e.g., 'ui', 'content', 'error'
    module?: string; // e.g., 'auth', 'user', 'carrier'
    component?: string; // e.g., 'button', 'form', 'table'
    field?: string; // e.g., 'email', 'password', 'name'
  };

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  approvedBy: string; // User ID who approved the translation

  @Column({ type: "timestamp", nullable: true })
  approvedAt: Date;

  @Column({ default: 0 })
  usageCount: number; // How many times this translation has been used

  @Column({ type: "timestamp", nullable: true })
  lastUsedAt: Date;
}







