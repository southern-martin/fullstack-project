import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "../../domain/entities/role.entity";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";

@Injectable()
export class RoleRepository implements RoleRepositoryInterface {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>
  ) {}

  async findById(id: number): Promise<Role | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.repository.findOne({ where: { name } });
  }

  async save(role: Role): Promise<Role> {
    return this.repository.save(role);
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
    return this.repository.find({
      take: limit,
      skip: offset,
      order: { createdAt: "DESC" },
    });
  }

  async findByIds(ids: number[]): Promise<Role[]> {
    return this.repository.findByIds(ids);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}


