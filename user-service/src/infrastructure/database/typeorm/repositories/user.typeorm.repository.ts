import { User } from "@/domain/entities/user.entity";
import { UserRepositoryInterface } from "@/domain/repositories/user.repository.interface";
import {
  BaseTypeOrmRepository,
  PaginationDto,
  RedisCacheService,
} from "@fullstack-project/shared-infrastructure";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { RoleTypeOrmEntity } from "../entities/role.typeorm.entity";
import { UserTypeOrmEntity } from "../entities/user.typeorm.entity";

/**
 * UserTypeOrmRepository
 *
 * This class provides the concrete TypeORM implementation for the UserRepositoryInterface.
 * It handles all database operations for user entities with Redis caching support.
 * Extends BaseTypeOrmRepository for common CRUD operations.
 */
@Injectable()
export class UserTypeOrmRepository
  extends BaseTypeOrmRepository<User, UserTypeOrmEntity>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    protected readonly repository: Repository<UserTypeOrmEntity>,
    protected readonly cacheService: RedisCacheService
  ) {
    super(repository, cacheService, "user", 300); // 5-minute cache TTL
  }

  /**
   * Find user by email (cached)
   */
  async findByEmail(email: string): Promise<User | null> {
    const cacheKey = `email:${email.toLowerCase()}`;

    // Try cache first
    const cached = await this.cacheService.get<User>(cacheKey);
    if (cached) return cached;

    // Fetch from database
    const entity = await this.repository.findOne({
      where: { email: email.toLowerCase() },
      relations: ["roles"],
    });

    if (!entity) return null;

    const user = this.toDomainEntity(entity);

    // Cache the result
    await this.cacheService.set(cacheKey, user, { ttl: 300 });

    return user;
  }

  /**
   * Find all users with pagination (cached)
   */
  async findAll(
    paginationDto: PaginationDto
  ): Promise<{ users: User[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      relations: ["roles"],
      order: { createdAt: "DESC" },
    });

    return {
      users: entities.map((entity) => this.toDomainEntity(entity)),
      total,
    };
  }

  /**
   * Find active users
   */
  async findActive(): Promise<User[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      relations: ["roles"],
      order: { createdAt: "DESC" },
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Search users by term
   */
  async search(
    searchTerm: string,
    paginationDto: PaginationDto
  ): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("user");

    queryBuilder
      .leftJoinAndSelect("user.roles", "role")
      .where(
        "(user.firstName LIKE :searchTerm OR user.lastName LIKE :searchTerm OR user.email LIKE :searchTerm)",
        { searchTerm: `%${searchTerm}%` }
      );

    const [entities, total] = await queryBuilder
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .take(paginationDto.limit)
      .orderBy("user.createdAt", "DESC")
      .getManyAndCount();

    return {
      users: entities.map((entity) => this.toDomainEntity(entity)),
      total,
    };
  }

  /**
   * Update user with cache invalidation
   */
  async update(id: number, user: Partial<User>): Promise<User> {
    // Separate roles from other user data
    const { roles, ...userData } = user;

    // Find the existing user entity with relations
    const userEntity = await this.repository.findOne({
      where: { id },
      relations: ["roles"],
    });

    if (!userEntity) {
      throw new Error(`User with id ${id} not found`);
    }

    // Update basic user fields manually to avoid overwriting password and other fields
    if (Object.keys(userData).length > 0) {
      const updates = this.toTypeOrmEntity(userData as User);
      // Only update fields that are actually provided
      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          userEntity[key] = updates[key];
        }
      });
    }

    // Update roles if provided (convert domain Role entities to TypeORM entities)
    if (roles !== undefined) {
      // Map domain Role entities to TypeORM RoleTypeOrmEntity
      userEntity.roles = roles.map((role) => {
        const roleEntity = new RoleTypeOrmEntity();
        roleEntity.id = role.id;
        roleEntity.name = role.name;
        roleEntity.description = role.description;
        roleEntity.isActive = role.isActive;
        return roleEntity;
      });
    }

    // Save the entity (cascade will handle roles)
    const savedEntity = await this.repository.save(userEntity);

    // Invalidate cache
    await this.invalidateCaches(id, savedEntity.email);

    // Return the updated user as domain entity
    return this.toDomainEntity(savedEntity);
  }

  /**
   * Delete a user by ID
   */
  async delete(id: number): Promise<void> {
    // Invalidate cache before deletion
    const user = await this.findById(id);
    if (user) {
      await this.invalidateCaches(id, user.email);
    }
    await super.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { email: email.toLowerCase() },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async countActive(): Promise<number> {
    return await this.repository.count({
      where: { isActive: true },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
    const entities = await this.repository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ["roles"],
      order: { createdAt: "DESC" },
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByRole(roleName: string): Promise<User[]> {
    const queryBuilder = this.repository.createQueryBuilder("user");

    queryBuilder
      .leftJoinAndSelect("user.roles", "role")
      .where("role.name = :roleName", { roleName });

    const entities = await queryBuilder.getMany();
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Invalidate all caches for a user
   */
  private async invalidateCaches(id: number, email?: string): Promise<void> {
    const promises: Promise<void>[] = [];

    // Invalidate ID-based cache
    promises.push(this.cacheService.del(`${this.cacheKeyPrefix}:${id}`));

    // Invalidate email-based cache if provided
    if (email) {
      promises.push(this.cacheService.del(`email:${email.toLowerCase()}`));
    }

    // Invalidate list cache
    promises.push(this.invalidateListCache());

    await Promise.all(promises);
  }

  // Helper methods for entity conversion
  protected toTypeOrmEntity(user: User): Partial<UserTypeOrmEntity> {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      isActive: user.isActive,
      phone: user.phone,
      lastLoginAt: user.lastLoginAt,
      passwordChangedAt: user.passwordChangedAt,
      isEmailVerified: user.isEmailVerified,
    };
  }

  protected toDomainEntity(entity: UserTypeOrmEntity): User {
    const user = new User();
    user.id = entity.id;
    user.email = entity.email;
    user.firstName = entity.firstName;
    user.lastName = entity.lastName;
    user.password = entity.password;
    user.isActive = entity.isActive;
    user.phone = entity.phone;
    user.lastLoginAt = entity.lastLoginAt;
    user.passwordChangedAt = entity.passwordChangedAt;
    user.isEmailVerified = entity.isEmailVerified;
    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;

    // Map roles if they exist
    if (entity.roles) {
      user.roles = entity.roles;
    }

    return user;
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role");

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
}
