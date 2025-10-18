import { User } from "@/domain/entities/user.entity";
import { UserRepositoryInterface } from "@/domain/repositories/user.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "@fullstack-project/shared-infrastructure";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { UserTypeOrmEntity } from "../entities/user.typeorm.entity";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>
  ) {}

  async findById(id: number): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["roles"],
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email },
      relations: ["roles"],
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async save(user: User): Promise<User> {
    const entity = await this.repository.save(user);
    return this.toDomainEntity(entity);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.repository.update(id, userData);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error("User not found after update");
    }
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { email },
    });
    return count > 0;
  }

  async findMany(limit: number, offset: number): Promise<User[]> {
    const entities = await this.repository.find({
      take: limit,
      skip: offset,
      relations: ["roles"],
      order: { createdAt: "DESC" },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async create(user: User): Promise<User> {
    const entity = this.toTypeOrmEntity(user);
    
    // Hash password before saving (CRITICAL SECURITY FIX)
    if (user.password) {
      entity.password = await bcrypt.hash(user.password, 10);
    }
    
    const savedEntity = await this.repository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "roles");

    if (search) {
      queryBuilder.where(
        "user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search",
        { search: `%${search}%` }
      );
    }

    if (pagination) {
      queryBuilder
        .skip((pagination.page - 1) * pagination.limit)
        .take(pagination.limit);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();
    const users = entities.map((entity) => this.toDomainEntity(entity));
    return { users, total };
  }

  async search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ users: User[]; total: number }> {
    return this.findAll(pagination, searchTerm);
  }

  async findActive(): Promise<User[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      relations: ["roles"],
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async countActive(): Promise<number> {
    return this.repository.count({ where: { isActive: true } });
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "roles");

    if (search) {
      queryBuilder.where(
        "user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search",
        { search: `%${search}%` }
      );
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const users = entities.map((entity) => this.toDomainEntity(entity));

    return { users, total };
  }

  async validatePassword(userId: number, password: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }

  async incrementFailedLoginAttempts(userId: number): Promise<void> {
    // Simplified - this functionality is not available with current schema
    console.warn('Failed login attempts tracking not available with current schema');
  }

  async resetFailedLoginAttempts(userId: number): Promise<void> {
    // Simplified - this functionality is not available with current schema
    console.warn('Failed login attempts reset not available with current schema');
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.repository.update(userId, { lastLoginAt: new Date() });
  }

  private toDomainEntity(entity: UserTypeOrmEntity): User {
    return new User({
      id: entity.id,
      email: entity.email,
      password: entity.password,
      firstName: entity.firstName,
      lastName: entity.lastName,
      phone: entity.phone,
      isActive: entity.isActive,
      isEmailVerified: entity.isEmailVerified,
      lastLoginAt: entity.lastLoginAt,
      passwordChangedAt: entity.passwordChangedAt,
      roles: entity.roles || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toTypeOrmEntity(user: User): UserTypeOrmEntity {
    const entity = new UserTypeOrmEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.password = user.password;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    entity.phone = user.phone;
    entity.isActive = user.isActive;
    entity.isEmailVerified = user.isEmailVerified;
    entity.lastLoginAt = user.lastLoginAt;
    entity.passwordChangedAt = user.passwordChangedAt;
    // Note: roles will be handled by the many-to-many relationship
    // entity.roles = user.roles || [];
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
}
