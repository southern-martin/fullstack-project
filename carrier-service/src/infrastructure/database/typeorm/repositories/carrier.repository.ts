import { Carrier } from "@/domain/entities/carrier.entity";
import { CarrierRepositoryInterface } from "@/domain/repositories/carrier.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "@shared/infrastructure";
import { Repository } from "typeorm";
import { CarrierTypeOrmEntity } from "../entities/carrier.typeorm.entity";

@Injectable()
export class CarrierRepository implements CarrierRepositoryInterface {
  constructor(
    @InjectRepository(CarrierTypeOrmEntity)
    private readonly repository: Repository<CarrierTypeOrmEntity>
  ) {}

  async create(carrier: Carrier): Promise<Carrier> {
    const entity = this.toTypeOrmEntity(carrier);
    const savedEntity = await this.repository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async findById(id: number): Promise<Carrier | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByName(name: string): Promise<Carrier | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ carriers: Carrier[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("carrier");

    if (search) {
      queryBuilder.where(
        "carrier.name ILIKE :search OR carrier.description ILIKE :search OR carrier.contactEmail ILIKE :search",
        { search: `%${search}%` }
      );
    }

    if (pagination) {
      queryBuilder
        .skip((pagination.page - 1) * pagination.limit)
        .take(pagination.limit);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();
    const carriers = entities.map((entity) => this.toDomainEntity(entity));
    return { carriers, total };
  }

  async search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ carriers: Carrier[]; total: number }> {
    return this.findAll(pagination, searchTerm);
  }

  async update(id: number, carrierData: Partial<Carrier>): Promise<Carrier> {
    await this.repository.update(id, carrierData);
    const updatedCarrier = await this.findById(id);
    if (!updatedCarrier) {
      throw new Error("Carrier not found after update");
    }
    return updatedCarrier;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findActive(): Promise<Carrier[]> {
    const entities = await this.repository.find({ where: { isActive: true } });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async countActive(): Promise<number> {
    return this.repository.count({ where: { isActive: true } });
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ carriers: Carrier[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("carrier");

    if (search) {
      queryBuilder.where(
        "carrier.name ILIKE :search OR carrier.description ILIKE :search OR carrier.contactEmail ILIKE :search",
        { search: `%${search}%` }
      );
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const carriers = entities.map((entity) => this.toDomainEntity(entity));

    return { carriers, total };
  }

  private toDomainEntity(entity: CarrierTypeOrmEntity): Carrier {
    return new Carrier({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      contactEmail: entity.contactEmail,
      contactPhone: entity.contactPhone,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toTypeOrmEntity(carrier: Carrier): CarrierTypeOrmEntity {
    const entity = new CarrierTypeOrmEntity();
    entity.id = carrier.id;
    entity.name = carrier.name;
    entity.description = carrier.description;
    entity.isActive = carrier.isActive;
    entity.contactEmail = carrier.contactEmail;
    entity.contactPhone = carrier.contactPhone;
    entity.metadata = carrier.metadata;
    entity.createdAt = carrier.createdAt;
    entity.updatedAt = carrier.updatedAt;
    return entity;
  }
}
