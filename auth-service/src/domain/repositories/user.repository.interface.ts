import { User } from "../entities/user.entity";
import { Email } from "../value-objects/email.vo";

export interface UserRepositoryInterface {
  findById(id: number): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
  exists(email: Email): Promise<boolean>;
  findMany(limit: number, offset: number): Promise<User[]>;
  count(): Promise<number>;
}








