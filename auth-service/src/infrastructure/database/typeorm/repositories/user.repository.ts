import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../domain/entities/user.entity";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { Email } from "../../domain/value-objects/email.vo";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["roles"],
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.repository.findOne({
      where: { email: email.getValue() },
      relations: ["roles"],
    });
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.repository.update(id, userData);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error("User not found after update");
    }
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(email: Email): Promise<boolean> {
    const count = await this.repository.count({
      where: { email: email.getValue() },
    });
    return count > 0;
  }

  async findMany(limit: number, offset: number): Promise<User[]> {
    return this.repository.find({
      take: limit,
      skip: offset,
      relations: ["roles"],
      order: { createdAt: "DESC" },
    });
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}








