import { PaginationDto } from "@shared/infrastructure";
import { LanguageValue } from "../entities/language-value.entity";

export interface LanguageValueRepositoryInterface {
  create(languageValue: LanguageValue): Promise<LanguageValue>;
  findById(id: number): Promise<LanguageValue | null>;
  findByKey(key: string): Promise<LanguageValue | null>;
  findByKeyAndLanguage(
    key: string,
    languageId: number
  ): Promise<LanguageValue | null>;
  save(languageValue: LanguageValue): Promise<LanguageValue>;
  update(
    id: number,
    languageValue: Partial<LanguageValue>
  ): Promise<LanguageValue>;
  findMany(ids: number[]): Promise<LanguageValue[]>;
  findByLanguage(languageId: number): Promise<LanguageValue[]>;
  findByContext(context: any): Promise<LanguageValue[]>;
  findPendingApproval(): Promise<LanguageValue[]>;
  count(): Promise<number>;
  countByLanguage(languageId: number): Promise<number>;
  countApprovedByLanguage(languageId: number): Promise<number>;
  incrementUsageCount(id: number): Promise<void>;
  search(query: string): Promise<LanguageValue[]>;
  findPaginated(pagination: PaginationDto): Promise<{
    languageValues: LanguageValue[];
    total: number;
  }>;
  delete(id: number): Promise<void>;
}
