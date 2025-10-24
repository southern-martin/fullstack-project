import { Permission } from "@/domain/entities/permission.entity";
import { PermissionRepositoryInterface } from "@/domain/repositories/permission.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PermissionTypeOrmEntity } from "../entities/permission.typeorm.entity";

/**
 * PermissionTypeOrmRepository
 *
 * This class provides the concrete TypeORM implementation for the PermissionRepositoryInterface.
 * It handles all database operations for permission entities.
 */
@Injectable()
export class PermissionTypeOrmRepository implements PermissionRepositoryInterface {
  constructor(
    @InjectRepository(PermissionTypeOrmEntity)
    private readonly permissionRepository: Repository<PermissionTypeOrmEntity>
  ) {}

  async findAll(): Promise<Permission[]> {
    const entities = await this.permissionRepository.find({
      order: {
        category: 'ASC',
        name: 'ASC',
      },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findById(id: number): Promise<Permission | null> {
    const entity = await this.permissionRepository.findOne({
      where: { id },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const entity = await this.permissionRepository.findOne({
      where: { name },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByCategory(category: string): Promise<Permission[]> {
    const entities = await this.permissionRepository.find({
      where: { category },
      order: { name: 'ASC' },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByIds(ids: number[]): Promise<Permission[]> {
    if (ids.length === 0) {
      return [];
    }
    const entities = await this.permissionRepository.find({
      where: { id: In(ids) },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByNames(names: string[]): Promise<Permission[]> {
    if (names.length === 0) {
      return [];
    }
    const entities = await this.permissionRepository.find({
      where: { name: In(names) },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async getCategories(): Promise<string[]> {
    const result = await this.permissionRepository
      .createQueryBuilder('permission')
      .select('DISTINCT permission.category', 'category')
      .orderBy('permission.category', 'ASC')
      .getRawMany();
    
    return result.map((row) => row.category);
  }

  async create(permission: Permission): Promise<Permission> {
    const entity = this.toTypeOrmEntity(permission);
    const savedEntity = await this.permissionRepository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async update(id: number, permission: Partial<Permission>): Promise<Permission> {
    await this.permissionRepository.update(id, this.toTypeOrmEntity(permission));
    const updatedEntity = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!updatedEntity) {
      throw new Error("Permission not found after update");
    }
    return this.toDomainEntity(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.permissionRepository.delete(id);
  }

  async count(): Promise<number> {
    return this.permissionRepository.count();
  }

  /**
   * Convert TypeORM entity to domain entity
   */
  private toDomainEntity(entity: PermissionTypeOrmEntity): Permission {
    return new Permission({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      category: entity.category,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Convert domain entity to TypeORM entity
   */
  private toTypeOrmEntity(permission: Partial<Permission>): Partial<PermissionTypeOrmEntity> {
    const entity: Partial<PermissionTypeOrmEntity> = {};
    
    if (permission.id !== undefined) entity.id = permission.id;
    if (permission.name !== undefined) entity.name = permission.name;
    if (permission.description !== undefined) entity.description = permission.description;
    if (permission.category !== undefined) entity.category = permission.category;
    if (permission.createdAt !== undefined) entity.createdAt = permission.createdAt;
    if (permission.updatedAt !== undefined) entity.updatedAt = permission.updatedAt;
    
    return entity;
  }
}
