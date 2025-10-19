import { PaginationDto } from "@shared/infrastructure";
import { Language } from "../entities/language.entity";

export interface LanguageRepositoryInterface {
  create(language: Language): Promise<Language>;
  findById(code: string): Promise<Language | null>; // code is the primary key in old system
  findByCode(code: string): Promise<Language | null>;
  findDefault(): Promise<Language | null>;
  save(language: Language): Promise<Language>;
  update(code: string, language: Partial<Language>): Promise<Language>;
  findMany(codes: string[]): Promise<Language[]>;
  findActive(): Promise<Language[]>;
  count(): Promise<number>;
  countActive(): Promise<number>;
  search(query: string): Promise<Language[]>;
  findPaginated(pagination: PaginationDto): Promise<{
    languages: Language[];
    total: number;
  }>;
  delete(code: string): Promise<void>;
}
