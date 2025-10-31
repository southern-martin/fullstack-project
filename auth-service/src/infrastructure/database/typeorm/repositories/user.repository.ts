import { User } from '@/domain/entities/user.entity';
import { UserRepositoryInterface } from '@/domain/repositories/user.repository.interface';
import {
  BaseTypeOrmRepository,
  PaginationDto,
  RedisCacheService,
  WinstonLoggerService,
} from '@fullstack-project/shared-infrastructure';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserTypeOrmEntity } from '../entities/user.typeorm.entity';

/**
 * User Repository Implementation
 * Extends BaseTypeOrmRepository for common CRUD and caching operations
 */
@Injectable()
export class UserRepository
  extends BaseTypeOrmRepository<User, UserTypeOrmEntity>
  implements UserRepositoryInterface
{
  private readonly winstonLogger: WinstonLoggerService;

  constructor(
    @InjectRepository(UserTypeOrmEntity)
    repository: Repository<UserTypeOrmEntity>,
    @Inject(RedisCacheService)
    cacheService: RedisCacheService,
  ) {
    super(repository, cacheService, 'users', 300); // 5 min TTL
    this.winstonLogger = new WinstonLoggerService();
    this.winstonLogger.setContext('UserRepository');
  }

  /**
   * Find user by ID with roles and permissions
   */
  async findById(id: number): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissionEntities'],
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  /**
   * Find user by email with roles and permissions
   */
  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissionEntities'],
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  /**
   * Save user (legacy method for compatibility)
   */
  async save(user: User): Promise<User> {
    const entity = await this.repository.save(user);
    return this.toDomainEntity(entity);
  }

  /**
   * Check if email exists
   */
  async exists(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { email },
    });
    return count > 0;
  }

  /**
   * Find many users (legacy method)
   */
  async findMany(limit: number, offset: number): Promise<User[]> {
    const entities = await this.repository.find({
      take: limit,
      skip: offset,
      relations: ['roles', 'roles.permissionEntities'],
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Count total users (interface requirement)
   */
  async count(): Promise<number> {
    return this.repository.count();
  }

  /**
   * Create user with password hashing
   */
  async create(user: User): Promise<User> {
    const entity = this.toTypeOrmEntity(user);

    // Hash password before saving (CRITICAL SECURITY FIX)
    if (user.password) {
      entity.password = await bcrypt.hash(user.password, 10);
    }

    const savedEntity = await this.repository.save(entity);
    await this.invalidateListCache(); // Invalidate cache after creation
    return this.toDomainEntity(savedEntity);
  }

  /**
   * Find all users with pagination and search (uses caching)
   */
  async findAll(
    pagination?: PaginationDto,
    search?: string,
  ): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissionEntities', 'permissions');

    if (search) {
      queryBuilder.where(
        'user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (pagination) {
      queryBuilder.skip((pagination.page - 1) * pagination.limit).take(pagination.limit);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();
    const users = entities.map((entity) => this.toDomainEntity(entity));
    return { users, total };
  }

  /**
   * Search users (alias for findAll)
   */
  async search(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<{ users: User[]; total: number }> {
    return this.findAll(pagination, searchTerm);
  }

  /**
   * Find active users
   */
  async findActive(): Promise<User[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      relations: ['roles', 'roles.permissionEntities'],
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Count active users
   */
  async countActive(): Promise<number> {
    return this.repository.count({ where: { isActive: true } });
  }

  /**
   * Find paginated users
   */
  async findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissionEntities', 'permissions');

    if (search) {
      queryBuilder.where(
        'user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const users = entities.map((entity) => this.toDomainEntity(entity));

    return { users, total };
  }

  /**
   * Validate password
   */
  async validatePassword(userId: number, password: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }

  /**
   * Increment failed login attempts (placeholder)
   */
  async incrementFailedLoginAttempts(userId: number): Promise<void> {
    // Simplified - this functionality is not available with current schema
    this.winstonLogger.warn('Failed login attempts tracking not available with current schema', {
      userId,
    });
  }

  /**
   * Reset failed login attempts (placeholder)
   */
  async resetFailedLoginAttempts(userId: number): Promise<void> {
    // Simplified - this functionality is not available with current schema
    this.winstonLogger.warn('Failed login attempts reset not available with current schema', {
      userId,
    });
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: number): Promise<void> {
    await this.repository.update(userId, { lastLoginAt: new Date() });
  }

  /**
   * Convert TypeORM entity to domain entity
   */
  protected toDomainEntity(entity: UserTypeOrmEntity): User {
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

  /**
   * Convert domain entity to TypeORM entity
   */
  protected toTypeOrmEntity(user: User): UserTypeOrmEntity {
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
