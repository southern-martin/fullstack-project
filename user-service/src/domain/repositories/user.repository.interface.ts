import { User } from '../entities/user.entity';

export interface UserRepositoryInterface {
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
  findActive(): Promise<User[]>;
  findPaginated(page: number, limit: number, search?: string): Promise<{ users: User[]; total: number }>;
}








