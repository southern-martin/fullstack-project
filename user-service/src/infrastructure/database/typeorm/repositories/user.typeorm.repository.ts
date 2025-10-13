import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { UserTypeOrmEntity } from '../entities/user.typeorm.entity';
import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { PaginationDto } from '../../../../shared/dto';

/**
 * UserTypeOrmRepository
 * 
 * This class provides the concrete TypeORM implementation for the UserRepositoryInterface.
 * It handles all database operations for user entities.
 */
@Injectable()
export class UserTypeOrmRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly userRepository: Repository<UserTypeOrmEntity>
  ) {}

  async create(user: User): Promise<User> {
    const userEntity = this.toTypeOrmEntity(user);
    const savedEntity = await this.userRepository.save(userEntity);
    return this.toDomainEntity(savedEntity);
  }

  async findById(id: number): Promise<User | null> {
    const entity = await this.userRepository.findOne({ 
      where: { id },
      relations: ['userRoles', 'userRoles.role']
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ 
      where: { email: email.toLowerCase() },
      relations: ['userRoles', 'userRoles.role']
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findAll(paginationDto: PaginationDto): Promise<{ users: User[]; total: number }> {
    const [entities, total] = await this.userRepository.findAndCount({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      relations: ['userRoles', 'userRoles.role'],
      order: { createdAt: 'DESC' },
    });

    return {
      users: entities.map(entity => this.toDomainEntity(entity)),
      total,
    };
  }

  async findActive(): Promise<User[]> {
    const entities = await this.userRepository.find({
      where: { isActive: true },
      relations: ['userRoles', 'userRoles.role'],
      order: { createdAt: 'DESC' },
    });

    return entities.map(entity => this.toDomainEntity(entity));
  }

  async search(searchTerm: string, paginationDto: PaginationDto): Promise<{ users: User[]; total: number }> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    queryBuilder
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .where(
        '(user.firstName LIKE :searchTerm OR user.lastName LIKE :searchTerm OR user.email LIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` }
      );

    const [entities, total] = await queryBuilder
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .take(paginationDto.limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return {
      users: entities.map(entity => this.toDomainEntity(entity)),
      total,
    };
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, this.toTypeOrmEntity(user as User));
    const updatedEntity = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role']
    });
    return this.toDomainEntity(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email: email.toLowerCase() }
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return await this.userRepository.count();
  }

  async countActive(): Promise<number> {
    return await this.userRepository.count({
      where: { isActive: true }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
    const entities = await this.userRepository.find({
      where: {
        createdAt: Between(startDate, endDate)
      },
      relations: ['userRoles', 'userRoles.role'],
      order: { createdAt: 'DESC' },
    });

    return entities.map(entity => this.toDomainEntity(entity));
  }

  async findByRole(roleName: string): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    queryBuilder
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .where('role.name = :roleName', { roleName });

    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.toDomainEntity(entity));
  }

  // Helper methods for entity conversion
  private toTypeOrmEntity(user: User): Partial<UserTypeOrmEntity> {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      isActive: user.isActive,
      dateOfBirth: user.dateOfBirth,
      phone: user.phone,
      address: user.address,
      preferences: user.preferences,
      lastLoginAt: user.lastLoginAt,
      emailVerifiedAt: user.emailVerifiedAt,
      isEmailVerified: user.isEmailVerified,
      metadata: user.metadata,
    };
  }

  private toDomainEntity(entity: UserTypeOrmEntity): User {
    const user = new User();
    user.id = entity.id;
    user.email = entity.email;
    user.firstName = entity.firstName;
    user.lastName = entity.lastName;
    user.password = entity.password;
    user.isActive = entity.isActive;
    user.dateOfBirth = entity.dateOfBirth;
    user.phone = entity.phone;
    user.address = entity.address;
    user.preferences = entity.preferences;
    user.lastLoginAt = entity.lastLoginAt;
    user.emailVerifiedAt = entity.emailVerifiedAt;
    user.isEmailVerified = entity.isEmailVerified;
    user.metadata = entity.metadata;
    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;

    // Map roles if they exist
    if (entity.userRoles) {
      user.roles = entity.userRoles.map(userRole => userRole.role);
    }

    return user;
  }
}
