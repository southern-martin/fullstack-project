import { LanguageValue } from "@/domain/entities/language-value.entity";
import { LanguageValueRepositoryInterface } from "@/domain/repositories/language-value.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "@shared/infrastructure";
import { Repository } from "typeorm";
import { LanguageValueTypeOrmEntity } from "../entities/language-value.typeorm.entity";

@Injectable()
export class LanguageValueRepository
  implements LanguageValueRepositoryInterface
{
  constructor(
    @InjectRepository(LanguageValueTypeOrmEntity)
    private readonly repository: Repository<LanguageValueTypeOrmEntity>
  ) {}

  async create(languageValue: LanguageValue): Promise<LanguageValue> {
    const entity = this.toTypeOrmEntity(languageValue);
    const savedEntity = await this.repository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async findById(id: number): Promise<LanguageValue | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByKey(key: string): Promise<LanguageValue | null> {
    const entity = await this.repository.findOne({ where: { key } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByKeyAndLanguage(
    key: string,
    languageId: number
  ): Promise<LanguageValue | null> {
    const entity = await this.repository.findOne({
      where: { key, languageId },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async save(languageValue: LanguageValue): Promise<LanguageValue> {
    const entity = this.toTypeOrmEntity(languageValue);
    const savedEntity = await this.repository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async update(
    id: number,
    languageValue: Partial<LanguageValue>
  ): Promise<LanguageValue> {
    await this.repository.update(id, languageValue);
    const updatedLanguageValue = await this.findById(id);
    if (!updatedLanguageValue) {
      throw new Error(`LanguageValue with id ${id} not found`);
    }
    return updatedLanguageValue;
  }

  async findMany(ids: number[]): Promise<LanguageValue[]> {
    const entities = await this.repository.findByIds(ids);
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByLanguage(languageId: number): Promise<LanguageValue[]> {
    const entities = await this.repository.find({
      where: { languageId },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByContext(context: any): Promise<LanguageValue[]> {
    const entities = await this.repository
      .createQueryBuilder("languageValue")
      .where("JSON_EXTRACT(languageValue.context, '$.category') = :category", {
        category: context.category,
      })
      .orWhere("JSON_EXTRACT(languageValue.context, '$.module') = :module", {
        module: context.module,
      })
      .orWhere(
        "JSON_EXTRACT(languageValue.context, '$.component') = :component",
        {
          component: context.component,
        }
      )
      .getMany();
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findPendingApproval(): Promise<LanguageValue[]> {
    const entities = await this.repository.find({
      where: { isApproved: false },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async countByLanguage(languageId: number): Promise<number> {
    return this.repository.count({ where: { languageId } });
  }

  async countApprovedByLanguage(languageId: number): Promise<number> {
    return this.repository.count({
      where: { languageId, isApproved: true },
    });
  }

  async incrementUsageCount(id: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(LanguageValueTypeOrmEntity)
      .set({
        usageCount: () => "usageCount + 1",
        lastUsedAt: new Date(),
      })
      .where("id = :id", { id })
      .execute();
  }

  async search(query: string): Promise<LanguageValue[]> {
    const entities = await this.repository
      .createQueryBuilder("languageValue")
      .where("languageValue.originalText ILIKE :query", { query: `%${query}%` })
      .orWhere("languageValue.translatedText ILIKE :query", {
        query: `%${query}%`,
      })
      .orWhere("languageValue.key ILIKE :query", { query: `%${query}%` })
      .getMany();
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findPaginated(pagination: PaginationDto): Promise<{
    languageValues: LanguageValue[];
    total: number;
  }> {
    const queryBuilder = this.repository.createQueryBuilder("languageValue");

    // Apply search if provided
    if (pagination.search) {
      queryBuilder.where(
        "languageValue.originalText ILIKE :search OR languageValue.translatedText ILIKE :search OR languageValue.key ILIKE :search",
        { search: `%${pagination.search}%` }
      );
    }

    // Apply sorting
    if (pagination.sortBy && pagination.sortOrder) {
      queryBuilder.orderBy(
        `languageValue.${pagination.sortBy}`,
        pagination.sortOrder.toUpperCase() as "ASC" | "DESC"
      );
    } else {
      queryBuilder.orderBy("languageValue.createdAt", "DESC");
    }

    // Apply pagination
    queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit);

    const [entities, total] = await queryBuilder.getManyAndCount();
    const languageValues = entities.map((entity) =>
      this.toDomainEntity(entity)
    );
    return { languageValues, total };
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomainEntity(entity: LanguageValueTypeOrmEntity): LanguageValue {
    return new LanguageValue({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      key: entity.key,
      originalText: entity.originalText,
      translatedText: entity.translatedText,
      languageId: entity.languageId,
      context: entity.context,
      isApproved: entity.isApproved,
      approvedBy: entity.approvedBy,
      approvedAt: entity.approvedAt,
      usageCount: entity.usageCount,
      lastUsedAt: entity.lastUsedAt,
    });
  }

  private toTypeOrmEntity(
    languageValue: LanguageValue
  ): LanguageValueTypeOrmEntity {
    const entity = new LanguageValueTypeOrmEntity();
    entity.id = languageValue.id;
    entity.createdAt = languageValue.createdAt;
    entity.updatedAt = languageValue.updatedAt;
    entity.key = languageValue.key;
    entity.originalText = languageValue.originalText;
    entity.translatedText = languageValue.translatedText;
    entity.languageId = languageValue.languageId;
    entity.context = languageValue.context;
    entity.isApproved = languageValue.isApproved;
    entity.approvedBy = languageValue.approvedBy;
    entity.approvedAt = languageValue.approvedAt;
    entity.usageCount = languageValue.usageCount;
    entity.lastUsedAt = languageValue.lastUsedAt;
    return entity;
  }
}
