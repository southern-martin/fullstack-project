import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../domain/entities/role.entity';
import { RoleRepositoryInterface } from '../domain/repositories/role.repository.interface';

@Injectable()
export class RoleRepository implements RoleRepositoryInterface {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(role: Role): Promise<Role> {
    return await this.roleRepository.save(role);
  }

  async findById(id: number): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { name },
    });
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async update(id: number, roleData: Partial<Role>): Promise<Role> {
    await this.roleRepository.update(id, roleData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }

  async findActive(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { isActive: true },
    });
  }

  async findByPermission(permission: string): Promise<Role[]> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .where('JSON_CONTAINS(role.permissions, :permission)', { permission: `"${permission}"` })
      .getMany();
  }

  async findPaginated(page: number, limit: number, search?: string): Promise<{ roles: Role[]; total: number }> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (search) {
      queryBuilder.where(
        '(role.name LIKE :search OR role.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [roles, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { roles, total };
  }
}








