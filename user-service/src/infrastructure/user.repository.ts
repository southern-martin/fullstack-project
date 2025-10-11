import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import { UserRepositoryInterface } from '../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['roles'],
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['roles'],
    });
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findActive(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
      relations: ['roles'],
    });
  }

  async findPaginated(page: number, limit: number, search?: string): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role');

    if (search) {
      queryBuilder.where(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { users, total };
  }
}





