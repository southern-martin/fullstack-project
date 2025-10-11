import { Role } from '../entities/role.entity';

export interface RoleRepositoryInterface {
  create(role: Role): Promise<Role>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  update(id: number, role: Partial<Role>): Promise<Role>;
  delete(id: number): Promise<void>;
  findActive(): Promise<Role[]>;
  findByPermission(permission: string): Promise<Role[]>;
  findPaginated(page: number, limit: number, search?: string): Promise<{ roles: Role[]; total: number }>;
}






