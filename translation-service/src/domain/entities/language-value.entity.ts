import { Language } from "./language.entity";

export class LanguageValue {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  key: string; // MD5 hash of the original text
  languageCode: string; // Language code (e.g., 'en', 'es', 'fr')
  original: string; // Original text in source language
  destination: string; // Translated text
  language?: Language; // Optional reference to language entity
  context?: {
    category?: string; // e.g., 'ui', 'content', 'error'
    module?: string; // e.g., 'auth', 'user', 'carrier'
    component?: string; // e.g., 'button', 'form', 'table'
    field?: string; // e.g., 'email', 'password', 'name'
  };
  isApproved: boolean;
  approvedBy?: string; // User ID who approved the translation
  approvedAt?: Date;
  usageCount: number; // How many times this translation has been used
  lastUsedAt?: Date;

  constructor(data: Partial<LanguageValue> = {}) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.key = data.key || "";
    this.languageCode = data.languageCode || "";
    this.original = data.original || "";
    this.destination = data.destination || "";
    this.language = data.language;
    this.context = data.context;
    this.isApproved = data.isApproved ?? false;
    this.approvedBy = data.approvedBy;
    this.approvedAt = data.approvedAt;
    this.usageCount = data.usageCount ?? 0;
    this.lastUsedAt = data.lastUsedAt;
  }

  get isPendingApproval(): boolean {
    return !this.isApproved;
  }

  get hasBeenUsed(): boolean {
    return this.usageCount > 0;
  }
}
