import { Language } from "../entities/language.entity";

export interface LanguageRepositoryInterface {
  create(language: Language): Promise<Language>;
  findAll(): Promise<Language[]>;
  findActive(): Promise<Language[]>;
  findById(id: number): Promise<Language | null>;
  findByCode(code: string): Promise<Language | null>;
  findDefault(): Promise<Language | null>;
  update(id: number, language: Partial<Language>): Promise<Language>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
}







