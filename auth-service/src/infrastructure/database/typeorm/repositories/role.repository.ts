import { Role } from "@/domain/entities/role.entity";
import { RoleRepositoryInterface } from "@/domain/repositories/role.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "@fullstack-project/shared-infrastructure";
import { Repository } from "typeorm";
import { RoleTypeOrmEntity } from "../entities/role.typeorm.entity";

@Injectable()
export class RoleRepository implements RoleRepositoryInterface {
  constructor(
    @InjectRepository(RoleTypeOrmEntity)
    private readonly repository: Repository<RoleTypeOrmEntity>
  ) {}

  async findById(id: number): Promise<Role | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async save(role: Role): Promise<Role> {
    const entity = await this.repository.save(role);
    return this.toDomainEntity(entity);
  }

  async update(id: number, roleData: Partial<Role>): Promise<Role> {
    await this.repository.update(id, roleData);
    const updatedRole = await this.findById(id);
    if (!updatedRole) {
      throw new Error("Role not found after update");
    }
    return updatedRole;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findMany(limit: number, offset: number): Promise<Role[]> {
    const entities = await this.repository.find({
      take: limit,
      skip: offset,
      order: { createdAt: "DESC" },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByIds(ids: number[]): Promise<Role[]> {
    const entities = await this.repository.findByIds(ids);
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async create(role: Role): Promise<Role> {
    const entity = this.toTypeOrmEntity(role);
    const savedEntity = await this.repository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ roles: Role[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("role");

    if (search) {
      queryBuilder.where(
        "role.name ILIKE :search OR role.description ILIKE :search",
        { search: `%${search}%` }
      );
    }

    if (pagination) {
      queryBuilder
        .skip((pagination.page - 1) * pagination.limit)
        .take(pagination.limit);
    }

    const [roles, total] = await queryBuilder.getManyAndCount();
    return { roles, total };
  }

  async search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ roles: Role[]; total: number }> {
    return this.findAll(pagination, searchTerm);
  }

  async findActive(): Promise<Role[]> {
    const entities = await this.repository.find({ where: { isActive: true } });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByPermission(permission: string): Promise<Role[]> {
    const entities = await this.repository
      .createQueryBuilder("role")
      .where("role.permissions::jsonb ? :permission", { permission })
      .getMany();

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async countActive(): Promise<number> {
    return this.repository.count({ where: { isActive: true } });
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ roles: Role[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder("role");

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

  private toDomainEntity(entity: RoleTypeOrmEntity): Role {
    return new Role({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      permissions: entity.permissions,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toTypeOrmEntity(role: Role): RoleTypeOrmEntity {
    const entity = new RoleTypeOrmEntity();
    entity.id = role.id;
    entity.name = role.name;
    entity.description = role.description;
    entity.isActive = role.isActive;
    entity.permissions = role.permissions || [];
    entity.createdAt = role.createdAt;
    entity.updatedAt = role.updatedAt;
    return entity;
  }
}
