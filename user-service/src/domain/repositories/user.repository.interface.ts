import { PaginationDto } from "@fullstack-project/shared-infrastructure";
import { User } from "../entities/user.entity";

export interface UserRepositoryInterface {
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(
    pagination?: PaginationDto,
    search?: string
  ): Promise<{ users: User[]; total: number }>;
  search(
    searchTerm: string,
    pagination: PaginationDto
  ): Promise<{ users: User[]; total: number }>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
  findActive(): Promise<User[]>;
  findByRole(roleName: string): Promise<User[]>;
  count(): Promise<number>;
  countActive(): Promise<number>;
  findPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ users: User[]; total: number }>;
}
