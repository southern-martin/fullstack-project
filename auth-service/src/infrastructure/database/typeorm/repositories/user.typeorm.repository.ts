import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRepositoryInterface } from '../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../domain/entities/user.entity';
import { UserTypeOrmEntity } from '../entities/user.typeorm.entity';

/**
 * TypeORM implementation of User Repository
 * Infrastructure layer - handles database operations
 * Follows Clean Architecture principles
 */
@Injectable()
export class UserTypeOrmRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly userRepository: Repository<UserTypeOrmEntity>,
  ) {}

  /**
   * Find user by email
   * @param email - User email
   * @returns User entity or null
   */
  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['roles'],
    });

    return userEntity ? this.mapToDomainEntity(userEntity) : null;
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User entity or null
   */
  async findById(id: number): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    return userEntity ? this.mapToDomainEntity(userEntity) : null;
  }

  /**
   * Create new user
   * @param userData - User creation data
   * @returns Created user entity
   */
  async create(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive?: boolean;
    isEmailVerified?: boolean;
    roles?: any[];
  }): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create TypeORM entity
    const userEntity = this.userRepository.create({
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      isActive: userData.isActive ?? true,
      isEmailVerified: userData.isEmailVerified ?? false,
      roles: userData.roles || [],
    });

    // Save to database
    const savedEntity = await this.userRepository.save(userEntity);

    // Return domain entity
    return this.mapToDomainEntity(savedEntity);
  }

  /**
   * Update user
   * @param id - User ID
   * @param updateData - Update data
   * @returns Updated user entity
   */
  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findById(id);
  }

  /**
   * Delete user
   * @param id - User ID
   */
  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * Validate password
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password
   * @returns True if password is valid
   */
  async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update last login timestamp
   * @param userId - User ID
   */
  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * Update password
   * @param userId - User ID
   * @param newPassword - New password
   */
  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    });
  }

  /**
   * Increment failed login attempts
   * @param userId - User ID
   */
  async incrementFailedLoginAttempts(userId: number): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({
        failedLoginAttempts: () => 'failedLoginAttempts + 1',
        lastFailedLoginAt: new Date(),
      })
      .where('id = :id', { id: userId })
      .execute();
  }

  /**
   * Reset failed login attempts
   * @param userId - User ID
   */
  async resetFailedLoginAttempts(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      failedLoginAttempts: 0,
      lastFailedLoginAt: null,
    });
  }

  /**
   * Find all users with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @returns Users and pagination info
   */
  async findAll(page: number = 1, limit: number = 10): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [userEntities, total] = await this.userRepository.findAndCount({
      relations: ['roles'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users: userEntities.map(entity => this.mapToDomainEntity(entity)),
      total,
      page,
      limit,
    };
  }

  /**
   * Maps TypeORM entity to domain entity
   * @param entity - TypeORM entity
   * @returns Domain entity
   */
  private mapToDomainEntity(entity: UserTypeOrmEntity): User {
    const user = new User();
    user.id = entity.id;
    user.email = entity.email;
    user.password = entity.password;
    user.firstName = entity.firstName;
    user.lastName = entity.lastName;
    user.phone = entity.phone;
    user.isActive = entity.isActive;
    user.isEmailVerified = entity.isEmailVerified;
    user.failedLoginAttempts = entity.failedLoginAttempts;
    user.lastFailedLoginAt = entity.lastFailedLoginAt;
    user.lastLoginAt = entity.lastLoginAt;
    user.passwordChangedAt = entity.passwordChangedAt;
    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;
    user.roles = entity.roles || [];

    return user;
  }
}
