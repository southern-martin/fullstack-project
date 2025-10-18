import { Role } from "@/domain/entities/role.entity";
import { RoleRepositoryInterface } from "@/domain/repositories/role.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "@fullstack-project/shared-infrastructure";
import { Between, Repository } from "typeorm";
import { RoleTypeOrmEntity } from "../entities/role.typeorm.entity";

/**
 * RoleTypeOrmRepository
 *
 * This class provides the concrete TypeORM implementation for the RoleRepositoryInterface.
 * It handles all database operations for role entities.
 */
@Injectable()
export class RoleTypeOrmRepository implements RoleRepositoryInterface {
  constructor(
    @InjectRepository(RoleTypeOrmEntity)
    private readonly roleRepository: Repository<RoleTypeOrmEntity>
  ) {}

  async create(role: Role): Promise<Role> {
    const roleEntity = this.toTypeOrmEntity(role);
    const savedEntity = await this.roleRepository.save(roleEntity);
    return this.toDomainEntity(savedEntity);
  }

  async findById(id: number): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({
      where: { id },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({
      where: { name },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findAll(
    paginationDto?: PaginationDto
  ): Promise<{ roles: Role[]; total: number }> {
    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 100;
    
    const [entities, total] = await this.roleRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return {
      roles: entities.map((entity) => this.toDomainEntity(entity)),
      total,
    };
  }

  async findActive(): Promise<Role[]> {
    const entities = await this.roleRepository.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async search(
    searchTerm: string,
    paginationDto: PaginationDto
  ): Promise<{ roles: Role[]; total: number }> {
    const queryBuilder = this.roleRepository.createQueryBuilder("role");

    queryBuilder
      .where(
        "(role.name LIKE :searchTerm OR role.description LIKE :searchTerm)",
        { searchTerm: `%${searchTerm}%` }
      );

    const [entities, total] = await queryBuilder
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .take(paginationDto.limit)
      .orderBy("role.createdAt", "DESC")
      .getManyAndCount();

    return {
      roles: entities.map((entity) => this.toDomainEntity(entity)),
      total,
    };
  }

  async update(id: number, role: Partial<Role>): Promise<Role> {
    await this.roleRepository.update(id, this.toTypeOrmEntity(role as Role));
    const updatedEntity = await this.roleRepository.findOne({
      where: { id },
    });
    return this.toDomainEntity(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.roleRepository.count({
      where: { name },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.roleRepository.count();
  }

  async countActive(): Promise<number> {
    return await this.roleRepository.count({
      where: { isActive: true },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Role[]> {
    const entities = await this.roleRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: "DESC" },
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  // Helper methods for entity conversion
  private toTypeOrmEntity(role: Role): Partial<RoleTypeOrmEntity> {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      permissions: role.permissions,
    };
  }

  private toDomainEntity(entity: RoleTypeOrmEntity): Role {
    const role = new Role();
    role.id = entity.id;
    role.name = entity.name;
    role.description = entity.description;
    role.isActive = entity.isActive;
    role.permissions = entity.permissions;
    role.createdAt = entity.createdAt;
    role.updatedAt = entity.updatedAt;

    return role;
  }

  async findByPermission(permission: string): Promise<Role[]> {
    const entities = await this.roleRepository
      .createQueryBuilder("role")
      .where("role.permissions::jsonb ? :permission", { permission })
      .getMany();

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ roles: Role[]; total: number }> {
    const queryBuilder = this.roleRepository.createQueryBuilder("role");

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
