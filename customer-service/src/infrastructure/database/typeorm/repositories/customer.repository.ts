import { Customer } from "@/domain/entities/customer.entity";
import { CustomerRepositoryInterface } from "@/domain/repositories/customer.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "@shared/infrastructure";
import { Repository } from "typeorm";
import { CustomerTypeOrmEntity } from "../entities/customer.typeorm.entity";

@Injectable()
export class CustomerRepository implements CustomerRepositoryInterface {
  constructor(
    @InjectRepository(CustomerTypeOrmEntity)
    private readonly repository: Repository<CustomerTypeOrmEntity>
  ) {}

  async create(customer: Customer): Promise<Customer> {
    const entity = this.toTypeOrmEntity(customer);
    const savedEntity = await this.repository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async findById(id: number): Promise<Customer | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ customers: Customer[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("customer");

    if (search) {
      queryBuilder.where(
        "customer.firstName ILIKE :search OR customer.lastName ILIKE :search OR customer.email ILIKE :search",
        { search: `%${search}%` }
      );
    }

    if (pagination) {
      queryBuilder
        .skip((pagination.page - 1) * pagination.limit)
        .take(pagination.limit);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();
    const customers = entities.map((entity) => this.toDomainEntity(entity));
    return { customers, total };
  }

  async search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ customers: Customer[]; total: number }> {
    return this.findAll(pagination, searchTerm);
  }

  async update(id: number, customer: Partial<Customer>): Promise<Customer> {
    await this.repository.update(id, customer);
    const updatedCustomer = await this.findById(id);
    if (!updatedCustomer) {
      throw new Error("Customer not found after update");
    }
    return updatedCustomer;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findActive(): Promise<Customer[]> {
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
  ): Promise<{ customers: Customer[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("customer");

    if (search) {
      queryBuilder.where(
        "customer.firstName ILIKE :search OR customer.lastName ILIKE :search OR customer.email ILIKE :search",
        { search: `%${search}%` }
      );
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const customers = entities.map((entity) => this.toDomainEntity(entity));

    return { customers, total };
  }

  private toDomainEntity(entity: CustomerTypeOrmEntity): Customer {
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

  private toTypeOrmEntity(customer: Customer): CustomerTypeOrmEntity {
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
