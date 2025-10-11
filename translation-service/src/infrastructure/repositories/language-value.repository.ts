import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LanguageValue } from "../../domain/entities/language-value.entity";
import { LanguageValueRepositoryInterface } from "../../domain/repositories/language-value.repository.interface";

@Injectable()
export class LanguageValueRepository
  implements LanguageValueRepositoryInterface
{
  constructor(
    @InjectRepository(LanguageValue)
    private readonly languageValueRepository: Repository<LanguageValue>
  ) {}

  async create(languageValue: LanguageValue): Promise<LanguageValue> {
    return await this.languageValueRepository.save(languageValue);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ languageValues: LanguageValue[]; total: number }> {
    const queryBuilder = this.languageValueRepository
      .createQueryBuilder("lv")
      .leftJoinAndSelect("lv.language", "language");

    if (search) {
      queryBuilder.where(
        "lv.originalText LIKE :search OR lv.translatedText LIKE :search",
        { search: `%${search}%` }
      );
    }

    const [languageValues, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("lv.createdAt", "DESC")
      .getManyAndCount();

    return { languageValues, total };
  }

  async findById(id: number): Promise<LanguageValue | null> {
    return await this.languageValueRepository.findOne({
      where: { id },
      relations: ["language"],
    });
  }

  async findByKey(key: string): Promise<LanguageValue | null> {
    return await this.languageValueRepository.findOne({
      where: { key },
      relations: ["language"],
    });
  }

  async findByKeyAndLanguage(
    key: string,
    languageId: number
  ): Promise<LanguageValue | null> {
    return await this.languageValueRepository.findOne({
      where: { key, languageId },
      relations: ["language"],
    });
  }

  async findByLanguage(languageId: number): Promise<LanguageValue[]> {
    return await this.languageValueRepository.find({
      where: { languageId },
      relations: ["language"],
      order: { createdAt: "DESC" },
    });
  }

  async findByContext(context: any): Promise<LanguageValue[]> {
    const queryBuilder = this.languageValueRepository
      .createQueryBuilder("lv")
      .leftJoinAndSelect("lv.language", "language");

    if (context.category) {
      queryBuilder.andWhere("lv.context->>'$.category' = :category", {
        category: context.category,
      });
    }

    if (context.module) {
      queryBuilder.andWhere("lv.context->>'$.module' = :module", {
        module: context.module,
      });
    }

    if (context.component) {
      queryBuilder.andWhere("lv.context->>'$.component' = :component", {
        component: context.component,
      });
    }

    if (context.field) {
      queryBuilder.andWhere("lv.context->>'$.field' = :field", {
        field: context.field,
      });
    }

    return await queryBuilder.getMany();
  }

  async findPendingApproval(): Promise<LanguageValue[]> {
    return await this.languageValueRepository.find({
      where: { isApproved: false },
      relations: ["language"],
      order: { createdAt: "DESC" },
    });
  }

  async update(
    id: number,
    languageValue: Partial<LanguageValue>
  ): Promise<LanguageValue> {
    await this.languageValueRepository.update(id, languageValue);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.languageValueRepository.delete(id);
  }

  async count(): Promise<number> {
    return await this.languageValueRepository.count();
  }

  async incrementUsageCount(id: number): Promise<void> {
    await this.languageValueRepository
      .createQueryBuilder()
      .update(LanguageValue)
      .set({
        usageCount: () => "usageCount + 1",
        lastUsedAt: new Date(),
      })
      .where("id = :id", { id })
      .execute();
  }
}







