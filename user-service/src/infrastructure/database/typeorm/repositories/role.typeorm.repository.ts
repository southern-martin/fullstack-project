import { Role } from "@/domain/entities/role.entity";
import { RoleRepositoryInterface } from "@/domain/repositories/role.repository.interface";
import {
  BaseTypeOrmRepository,
  PaginationDto,
  RedisCacheService,
} from "@fullstack-project/shared-infrastructure";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { PermissionTypeOrmEntity } from "../entities/permission.typeorm.entity";
import { RoleTypeOrmEntity } from "../entities/role.typeorm.entity";

/**
 * RoleTypeOrmRepository
 *
 * This class provides the concrete TypeORM implementation for the RoleRepositoryInterface.
 * It handles all database operations for role entities with Redis caching support.
 * Extends BaseTypeOrmRepository for common CRUD operations.
 */
@Injectable()
export class RoleTypeOrmRepository
  extends BaseTypeOrmRepository<Role, RoleTypeOrmEntity>
  implements RoleRepositoryInterface
{
  constructor(
    @InjectRepository(RoleTypeOrmEntity)
    protected readonly repository: Repository<RoleTypeOrmEntity>,
    @InjectRepository(PermissionTypeOrmEntity)
    private readonly permissionRepository: Repository<PermissionTypeOrmEntity>,
    protected readonly cacheService: RedisCacheService
  ) {
    super(repository, cacheService, "role", 300); // 5-minute cache TTL
  }

  /**
   * Create role with optional permission associations
   */
  async create(role: Role, permissionIds?: number[]): Promise<Role> {
    const roleEntity = this.repository.create({
      name: role.name,
      description: role.description,
      isActive: role.isActive,
    });

    // Save the role first to get the ID
    const savedEntity = await this.repository.save(roleEntity);

    // If permissionIds are provided, fetch and associate them
    if (permissionIds && permissionIds.length > 0) {
      const permissions =
        await this.permissionRepository.findByIds(permissionIds);
      savedEntity.permissionEntities = permissions;
      await this.repository.save(savedEntity);
    }

    // Invalidate cache
    await this.invalidateListCache();

    // Fetch the complete role with permissions
    const completeEntity = await this.repository.findOne({
      where: { id: savedEntity.id },
      relations: ["permissionEntities"],
    });

    return this.toDomainEntity(completeEntity);
  }

  /**
   * Find role by ID with permissions (overrides base to include relations)
   */
  async findById(id: number): Promise<Role | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["permissionEntities"],
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  /**
   * Find role by name (cached)
   */
  async findByName(name: string): Promise<Role | null> {
    const cacheKey = `name:${name.toLowerCase()}`;

    // Try cache first
    const cached = await this.cacheService.get<Role>(cacheKey);
    if (cached) {
      return cached;
    }

    const entity = await this.repository.findOne({
      where: { name },
      relations: ["permissionEntities"],
    });

    if (!entity) {
      return null;
    }

    const role = this.toDomainEntity(entity);

    // Cache the result
    await this.cacheService.set(cacheKey, role, { ttl: this.cacheTTL });

    return role;
  }

  async findAll(
    paginationDto?: PaginationDto
  ): Promise<{ roles: Role[]; total: number }> {
    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 100;

    const [entities, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
      relations: ["permissionEntities"],
    });

    return {
      roles: entities.map((entity) => this.toDomainEntity(entity)),
      total,
    };
  }

  async findActive(): Promise<Role[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      order: { name: "ASC" },
      relations: ["permissionEntities"],
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async search(
    query: string,
    paginationDto?: PaginationDto
  ): Promise<{ roles: Role[]; total: number }> {
    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 100;

    const queryBuilder = this.repository
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.permissionEntities", "permission");

    queryBuilder.where(
      "(role.name LIKE :searchTerm OR role.description LIKE :searchTerm)",
      { searchTerm: `%${query}%` }
    );

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("role.createdAt", "DESC")
      .getManyAndCount();

    return {
      roles: entities.map((entity) => this.toDomainEntity(entity)),
      total,
    };
  }

  /**
   * Update role with cache invalidation
   */
  async update(
    id: number,
    role: Partial<Role>,
    permissionIds?: number[]
  ): Promise<Role> {
    // Update basic role properties
    await this.repository.update(id, this.toTypeOrmEntity(role as Role));

    // If permissionIds are provided, update the permissions
    if (permissionIds !== undefined) {
      const roleEntity = await this.repository.findOne({
        where: { id },
        relations: ["permissionEntities"],
      });

      if (roleEntity) {
        if (permissionIds.length > 0) {
          const permissions =
            await this.permissionRepository.findByIds(permissionIds);
          roleEntity.permissionEntities = permissions;
        } else {
          roleEntity.permissionEntities = [];
        }
        await this.repository.save(roleEntity);
      }
    }

    // Fetch and return the updated role with permissions
    const updatedEntity = await this.repository.findOne({
      where: { id },
      relations: ["permissionEntities"],
    });
    return this.toDomainEntity(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { name },
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

  async findByDateRange(startDate: Date, endDate: Date): Promise<Role[]> {
    const entities = await this.repository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: "DESC" },
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  // Helper methods for entity conversion
  protected toTypeOrmEntity(role: Role): Partial<RoleTypeOrmEntity> {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      // Note: permissions are handled via permissionEntities (relational system)
      // No need to set permissions field as it's been removed
    };
  }

  protected toDomainEntity(entity: RoleTypeOrmEntity): Role {
    const role = new Role();
    role.id = entity.id;
    role.name = entity.name;
    role.description = entity.description;
    role.isActive = entity.isActive;

    // ALWAYS use relational permissions from permissionEntities (relational system migration complete)
    // The JSON permissions column is deprecated and only kept for backward compatibility
    role.permissions = (entity.permissionEntities || []).map((p) => p.name);

    role.createdAt = entity.createdAt;
    role.updatedAt = entity.updatedAt;

    return role;
  }

  async findByPermission(permission: string): Promise<Role[]> {
    const entities = await this.repository
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.permissionEntities", "permission")
      .where("permission.name = :permission", { permission })
      .getMany();

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ roles: Role[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.permissionEntities", "permission");

    if (search) {
      queryBuilder.where(
        "role.name ILIKE :search OR role.description ILIKE :search",
        { search: `%${search}%` }
      );
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const roles = entities.map((entity) => this.toDomainEntity(entity));

    return { roles, total };
  }
}
