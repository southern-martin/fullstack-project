import { Language } from "@/domain/entities/language.entity";
import { LanguageRepositoryInterface } from "@/domain/repositories/language.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "@shared/infrastructure";
import { Repository } from "typeorm";
import { LanguageTypeOrmEntity } from "../entities/language.typeorm.entity";

@Injectable()
export class LanguageRepository implements LanguageRepositoryInterface {
  constructor(
    @InjectRepository(LanguageTypeOrmEntity)
    private readonly repository: Repository<LanguageTypeOrmEntity>
  ) {}

  async create(language: Language): Promise<Language> {
    const entity = this.toTypeOrmEntity(language);
    const savedEntity = await this.repository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async findById(code: string): Promise<Language | null> {
    // Note: In old system, code is the primary key (no separate id)
    const entity = await this.repository.findOne({ where: { code } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByCode(code: string): Promise<Language | null> {
    const entity = await this.repository.findOne({ where: { code } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findDefault(): Promise<Language | null> {
    const entity = await this.repository.findOne({
      where: { isDefault: true },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async save(language: Language): Promise<Language> {
    const entity = this.toTypeOrmEntity(language);
    const savedEntity = await this.repository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async update(code: string, language: Partial<Language>): Promise<Language> {
    await this.repository.update(code, language);
    const updatedLanguage = await this.findByCode(code);
    if (!updatedLanguage) {
      throw new Error(`Language with code ${code} not found`);
    }
    return updatedLanguage;
  }

  async findMany(codes: string[]): Promise<Language[]> {
    const entities = await this.repository.findByIds(codes);
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findActive(): Promise<Language[]> {
    const entities = await this.repository.find({ where: { status: 'active' } });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async countActive(): Promise<number> {
    return this.repository.count({ where: { status: 'active' } });
  }

  async search(query: string): Promise<Language[]> {
    const entities = await this.repository
      .createQueryBuilder("language")
      .where("language.name ILIKE :query", { query: `%${query}%` })
      .orWhere("language.localName ILIKE :query", { query: `%${query}%` })
      .orWhere("language.code ILIKE :query", { query: `%${query}%` })
      .getMany();
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findPaginated(pagination: PaginationDto): Promise<{
    languages: Language[];
    total: number;
  }> {
    const queryBuilder = this.repository.createQueryBuilder("language");

    // Apply search if provided
    if (pagination.search) {
      queryBuilder.where(
        "language.name ILIKE :search OR language.localName ILIKE :search OR language.code ILIKE :search",
        { search: `%${pagination.search}%` }
      );
    }

    // Apply sorting
    if (pagination.sortBy && pagination.sortOrder) {
      queryBuilder.orderBy(
        `language.${pagination.sortBy}`,
        pagination.sortOrder.toUpperCase() as "ASC" | "DESC"
      );
    } else {
      queryBuilder.orderBy("language.createdAt", "DESC");
    }

    // Apply pagination
    queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit);

    const [entities, total] = await queryBuilder.getManyAndCount();
    const languages = entities.map((entity) => this.toDomainEntity(entity));
    return { languages, total };
  }

  async delete(code: string): Promise<void> {
    await this.repository.delete(code);
  }

  private toDomainEntity(entity: LanguageTypeOrmEntity): Language {
    return new Language({
      code: entity.code,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      name: entity.name,
      localName: entity.localName,
      flag: entity.flag,
      status: entity.status,
      isDefault: entity.isDefault,
      metadata: entity.metadata,
    });
  }

  private toTypeOrmEntity(language: Language): LanguageTypeOrmEntity {
    const entity = new LanguageTypeOrmEntity();
    entity.code = language.code;
    entity.createdAt = language.createdAt;
    entity.updatedAt = language.updatedAt;
    entity.name = language.name;
    entity.localName = language.localName;
    entity.flag = language.flag;
    entity.status = language.status;
    entity.isDefault = language.isDefault;
    entity.metadata = language.metadata;
    return entity;
  }
}
