import { LanguageValue } from "../entities/language-value.entity";

export interface LanguageValueRepositoryInterface {
  create(languageValue: LanguageValue): Promise<LanguageValue>;
  findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ languageValues: LanguageValue[]; total: number }>;
  findById(id: number): Promise<LanguageValue | null>;
  findByKey(key: string): Promise<LanguageValue | null>;
  findByKeyAndLanguage(
    key: string,
    languageId: number
  ): Promise<LanguageValue | null>;
  findByLanguage(languageId: number): Promise<LanguageValue[]>;
  findByContext(context: any): Promise<LanguageValue[]>;
  findPendingApproval(): Promise<LanguageValue[]>;
  update(
    id: number,
    languageValue: Partial<LanguageValue>
  ): Promise<LanguageValue>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
  incrementUsageCount(id: number): Promise<void>;
}




