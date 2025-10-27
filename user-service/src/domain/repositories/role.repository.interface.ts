import { PaginationDto } from "@fullstack-project/shared-infrastructure";
import { Role } from "../entities/role.entity";

export interface RoleRepositoryInterface {
  create(role: Role, permissionIds?: number[]): Promise<Role>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ roles: Role[]; total: number }>;
  search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ roles: Role[]; total: number }>;
  update(
    id: number,
    role: Partial<Role>,
    permissionIds?: number[]
  ): Promise<Role>;
  delete(id: number): Promise<void>;
  findActive(): Promise<Role[]>;
  findByPermission(permission: string): Promise<Role[]>;
  count(): Promise<number>;
  countActive(): Promise<number>;
  findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ roles: Role[]; total: number }>;
}
