import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Role } from '../../domain/entities/role.entity';
import { RoleRepositoryInterface } from '../../domain/repositories/role.repository.interface';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleResponseDto } from '../dto/user-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RoleService {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    // Check if role name already exists
    const existingRole = await this.roleRepository.findByName(createRoleDto.name);
    if (existingRole) {
      throw new ConflictException('Role name already exists');
    }

    const role = new Role();
    role.name = createRoleDto.name;
    role.description = createRoleDto.description;
    role.isActive = createRoleDto.isActive ?? true;
    role.permissions = createRoleDto.permissions;
    role.metadata = createRoleDto.metadata;

    const savedRole = await this.roleRepository.create(role);
    return plainToClass(RoleResponseDto, savedRole, { excludeExtraneousValues: true });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ roles: RoleResponseDto[]; total: number }> {
    const { roles, total } = await this.roleRepository.findPaginated(page, limit, search);
    const roleDtos = roles.map(role => plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true }));
    return { roles: roleDtos, total };
  }

  async findById(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true });
  }

  async findByName(name: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true });
  }

  async findActive(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.findActive();
    return roles.map(role => plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true }));
  }

  async findByPermission(permission: string): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.findByPermission(permission);
    return roles.map(role => plainToClass(RoleResponseDto, role, { excludeExtraneousValues: true }));
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if role name is being changed and if it already exists
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findByName(updateRoleDto.name);
      if (existingRole) {
        throw new ConflictException('Role name already exists');
      }
    }

    const updatedRole = await this.roleRepository.update(id, updateRoleDto);
    return plainToClass(RoleResponseDto, updatedRole, { excludeExtraneousValues: true });
  }

  async delete(id: number): Promise<void> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    await this.roleRepository.delete(id);
  }

  async getCount(): Promise<number> {
    const { total } = await this.roleRepository.findPaginated(1, 1);
    return total;
  }

  async existsByName(name: string): Promise<boolean> {
    const role = await this.roleRepository.findByName(name);
    return !!role;
  }
}








