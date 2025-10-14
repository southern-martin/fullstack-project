import { PaginationDto } from "@shared/infrastructure";
import { Language } from "../entities/language.entity";

export interface LanguageRepositoryInterface {
  create(language: Language): Promise<Language>;
  findById(id: number): Promise<Language | null>;
  findByCode(code: string): Promise<Language | null>;
  findDefault(): Promise<Language | null>;
  save(language: Language): Promise<Language>;
  update(id: number, language: Partial<Language>): Promise<Language>;
  findMany(ids: number[]): Promise<Language[]>;
  findActive(): Promise<Language[]>;
  count(): Promise<number>;
  countActive(): Promise<number>;
  search(query: string): Promise<Language[]>;
  findPaginated(pagination: PaginationDto): Promise<{
    languages: Language[];
    total: number;
  }>;
  delete(id: number): Promise<void>;
}
