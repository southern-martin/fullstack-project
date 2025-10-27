import { Customer } from "@/domain/entities/customer.entity";
import { CustomerRepositoryInterface } from "@/domain/repositories/customer.repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  BaseTypeOrmRepository,
  PaginationDto,
  RedisCacheService,
} from "@shared/infrastructure";
import { Repository } from "typeorm";
import { CustomerTypeOrmEntity } from "../entities/customer.typeorm.entity";

/**
 * Customer Repository Implementation
 * Extends BaseTypeOrmRepository for common CRUD and caching operations
 */
@Injectable()
export class CustomerRepository
  extends BaseTypeOrmRepository<Customer, CustomerTypeOrmEntity>
  implements CustomerRepositoryInterface
{
  constructor(
    @InjectRepository(CustomerTypeOrmEntity)
    repository: Repository<CustomerTypeOrmEntity>,
    @Inject(RedisCacheService)
    cacheService: RedisCacheService
  ) {
    super(repository, cacheService, "customers", 300); // 5 min TTL
  }

  /**
   * Find customer by email
   * Business-specific query method
   */
  async findByEmail(email: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  /**
   * Find all customers with pagination and search
   * Uses base repository caching
   */
  async findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ customers: Customer[]; total: number }> {
    const result = await this.findAllWithCache(
      pagination,
      search,
      (qb, searchTerm) => {
        qb.where(
          "entity.firstName ILIKE :search OR entity.lastName ILIKE :search OR entity.email ILIKE :search",
          { search: `%${searchTerm}%` }
        );
      }
    );

    // Always sort by newest first for consistent pagination
    result.entities = await this.repository
      .createQueryBuilder("customer")
      .where(
        search
          ? "customer.firstName ILIKE :search OR customer.lastName ILIKE :search OR customer.email ILIKE :search"
          : "1=1",
        { search: `%${search}%` }
      )
      .orderBy("customer.createdAt", "DESC")
      .addOrderBy("customer.id", "DESC")
      .skip(((pagination?.page || 1) - 1) * (pagination?.limit || 20))
      .take(pagination?.limit || 20)
      .getMany()
      .then((entities) => entities.map((e) => this.toDomainEntity(e)));

    return { customers: result.entities, total: result.total };
  }

  /**
   * Search customers (alias for findAll with search)
   */
  async search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ customers: Customer[]; total: number }> {
    return this.findAll(pagination, searchTerm);
  }

  /**
   * Find active customers only
   */
  async findActive(): Promise<Customer[]> {
    const entities = await this.repository.find({ where: { isActive: true } });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Count total customers
   */
  async count(): Promise<number> {
    return this.repository.count();
  }

  /**
   * Count active customers
   */
  async countActive(): Promise<number> {
    return this.repository.count({ where: { isActive: true } });
  }

  /**
   * Find paginated customers (interface requirement)
   */
  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ customers: Customer[]; total: number }> {
    const pagination = Object.assign(
      Object.create(Object.getPrototypeOf(new PaginationDto())),
      { page, limit }
    );
    return this.findAll(pagination, search);
  }

  /**
   * Convert TypeORM entity to domain entity
   */
  protected toDomainEntity(entity: CustomerTypeOrmEntity): Customer {
    return new Customer({
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      phone: entity.phone,
      isActive: entity.isActive,
      dateOfBirth: entity.dateOfBirth,
      address: entity.address,
      preferences: entity.preferences,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Convert domain entity to TypeORM entity
   */
  protected toTypeOrmEntity(
    customer: Customer
  ): Partial<CustomerTypeOrmEntity> {
    const entity = new CustomerTypeOrmEntity();
    entity.id = customer.id;
    entity.email = customer.email;
    entity.firstName = customer.firstName;
    entity.lastName = customer.lastName;
    entity.phone = customer.phone;
    entity.isActive = customer.isActive;
    entity.dateOfBirth = customer.dateOfBirth;
    entity.address = customer.address;
    entity.preferences = customer.preferences;
    entity.createdAt = customer.createdAt;
    entity.updatedAt = customer.updatedAt;
    return entity;
  }
}
