import { Role } from '../entities/role.entity';
import { PaginationDto } from "@shared/infrastructure";

export interface RoleRepositoryInterface {
  create(role: Role): Promise<Role>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(pagination?: PaginationDto, search?: string): Promise<{ roles: Role[]; total: number }>;
  search(searchTerm: string, pagination: PaginationDto): Promise<{ roles: Role[]; total: number }>;
  update(id: number, role: Partial<Role>): Promise<Role>;
  delete(id: number): Promise<void>;
  findActive(): Promise<Role[]>;
  findByPermission(permission: string): Promise<Role[]>;
  count(): Promise<number>;
  countActive(): Promise<number>;
  findPaginated(page: number, limit: number, search?: string): Promise<{ roles: Role[]; total: number }>;
}








