import { Role } from "../entities/role.entity";

export interface RoleRepositoryInterface {
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  save(role: Role): Promise<Role>;
  update(id: number, role: Partial<Role>): Promise<Role>;
  delete(id: number): Promise<void>;
  findMany(limit: number, offset: number): Promise<Role[]>;
  findByIds(ids: number[]): Promise<Role[]>;
  count(): Promise<number>;
}








