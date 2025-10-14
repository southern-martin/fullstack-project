import { PriceCalculation } from "@/domain/entities/price-calculation.entity";
import { PriceCalculationRepositoryInterface } from "@/domain/repositories/price-calculation.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "@shared/infrastructure";
import { Repository } from "typeorm";
import { PriceCalculationTypeOrmEntity } from "../entities/price-calculation.typeorm.entity";

@Injectable()
export class PriceCalculationRepository
  implements PriceCalculationRepositoryInterface
{
  constructor(
    @InjectRepository(PriceCalculationTypeOrmEntity)
    private readonly repository: Repository<PriceCalculationTypeOrmEntity>
  ) {}

  async create(priceCalculation: PriceCalculation): Promise<PriceCalculation> {
    const entity = this.toTypeOrmEntity(priceCalculation);
    const savedEntity = await this.repository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async findById(id: number): Promise<PriceCalculation | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByRequestId(requestId: string): Promise<PriceCalculation | null> {
    const entity = await this.repository.findOne({ where: { requestId } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ priceCalculations: PriceCalculation[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("priceCalculation");

    if (search) {
      queryBuilder.where(
        "priceCalculation.requestId ILIKE :search OR JSON_EXTRACT(priceCalculation.request, '$.serviceType') ILIKE :search",
        { search: `%${search}%` }
      );
    }

    if (pagination) {
      queryBuilder
        .skip((pagination.page - 1) * pagination.limit)
        .take(pagination.limit);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();
    const priceCalculations = entities.map((entity) =>
      this.toDomainEntity(entity)
    );
    return { priceCalculations, total };
  }

  async search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ priceCalculations: PriceCalculation[]; total: number }> {
    return this.findAll(pagination, searchTerm);
  }

  async update(
    id: number,
    priceCalculationData: Partial<PriceCalculation>
  ): Promise<PriceCalculation> {
    await this.repository.update(id, priceCalculationData);
    const updatedPriceCalculation = await this.findById(id);
    if (!updatedPriceCalculation) {
      throw new Error("PriceCalculation not found after update");
    }
    return updatedPriceCalculation;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCustomerId(customerId: number): Promise<PriceCalculation[]> {
    const entities = await this.repository
      .createQueryBuilder("priceCalculation")
      .where(
        "JSON_EXTRACT(priceCalculation.request, '$.customerId') = :customerId",
        {
          customerId,
        }
      )
      .getMany();
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<PriceCalculation[]> {
    const entities = await this.repository
      .createQueryBuilder("priceCalculation")
      .where("priceCalculation.calculatedAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .getMany();
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ priceCalculations: PriceCalculation[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("priceCalculation");

    if (search) {
      queryBuilder.where(
        "priceCalculation.requestId ILIKE :search OR JSON_EXTRACT(priceCalculation.request, '$.serviceType') ILIKE :search",
        { search: `%${search}%` }
      );
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const priceCalculations = entities.map((entity) =>
      this.toDomainEntity(entity)
    );

    return { priceCalculations, total };
  }

  private toDomainEntity(
    entity: PriceCalculationTypeOrmEntity
  ): PriceCalculation {
    return new PriceCalculation({
      id: entity.id,
      requestId: entity.requestId,
      request: entity.request,
      calculation: entity.calculation,
      appliedRules: entity.appliedRules,
      calculatedAt: entity.calculatedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toTypeOrmEntity(
    priceCalculation: PriceCalculation
  ): PriceCalculationTypeOrmEntity {
    const entity = new PriceCalculationTypeOrmEntity();
    entity.id = priceCalculation.id;
    entity.requestId = priceCalculation.requestId;
    entity.request = priceCalculation.request;
    entity.calculation = priceCalculation.calculation;
    entity.appliedRules = priceCalculation.appliedRules;
    entity.calculatedAt = priceCalculation.calculatedAt;
    entity.createdAt = priceCalculation.createdAt;
    entity.updatedAt = priceCalculation.updatedAt;
    return entity;
  }
}
