import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Language } from "../../domain/entities/language.entity";
import { LanguageRepositoryInterface } from "../../domain/repositories/language.repository.interface";

@Injectable()
export class LanguageRepository implements LanguageRepositoryInterface {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>
  ) {}

  async create(language: Language): Promise<Language> {
    return await this.languageRepository.save(language);
  }

  async findAll(): Promise<Language[]> {
    return await this.languageRepository.find({
      order: { isDefault: "DESC", name: "ASC" },
    });
  }

  async findActive(): Promise<Language[]> {
    return await this.languageRepository.find({
      where: { isActive: true },
      order: { isDefault: "DESC", name: "ASC" },
    });
  }

  async findById(id: number): Promise<Language | null> {
    return await this.languageRepository.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<Language | null> {
    return await this.languageRepository.findOne({ where: { code } });
  }

  async findDefault(): Promise<Language | null> {
    return await this.languageRepository.findOne({
      where: { isDefault: true },
    });
  }

  async update(id: number, language: Partial<Language>): Promise<Language> {
    await this.languageRepository.update(id, language);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.languageRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.languageRepository.count();
  }
}







