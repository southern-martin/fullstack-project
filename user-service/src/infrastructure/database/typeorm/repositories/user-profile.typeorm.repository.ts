import { UserProfile } from "@/domain/entities/user-profile.entity";
import { UserProfileRepositoryInterface } from "@/domain/repositories/user-profile.repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfileTypeOrmEntity } from "../entities/user-profile.typeorm.entity";

/**
 * UserProfile TypeORM Repository
 * Implements profile data access using TypeORM
 */
@Injectable()
export class UserProfileTypeOrmRepository
  implements UserProfileRepositoryInterface
{
  constructor(
    @InjectRepository(UserProfileTypeOrmEntity)
    private readonly profileRepository: Repository<UserProfileTypeOrmEntity>
  ) {}

  async create(profile: UserProfile): Promise<UserProfile> {
    const entity = this.toTypeOrmEntity(profile);
    const savedEntity = await this.profileRepository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async findById(id: number): Promise<UserProfile | null> {
    const entity = await this.profileRepository.findOne({
      where: { id },
      relations: ["user"],
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByUserId(userId: number): Promise<UserProfile | null> {
    const entity = await this.profileRepository.findOne({
      where: { userId },
      relations: ["user"],
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async update(
    id: number,
    profile: Partial<UserProfile>
  ): Promise<UserProfile> {
    await this.profileRepository.update(id, this.toTypeOrmEntity(profile));
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.profileRepository.delete(id);
  }

  async existsByUserId(userId: number): Promise<boolean> {
    const count = await this.profileRepository.count({ where: { userId } });
    return count > 0;
  }

  /**
   * Convert domain entity to TypeORM entity
   */
  private toTypeOrmEntity(
    profile: Partial<UserProfile>
  ): Partial<UserProfileTypeOrmEntity> {
    return {
      id: profile.id,
      userId: profile.userId,
      dateOfBirth: profile.dateOfBirth,
      bio: profile.bio,
      avatar: profile.avatar,
      address: profile.address,
      socialLinks: profile.socialLinks,
      preferences: profile.preferences,
      metadata: profile.metadata,
    };
  }

  /**
   * Convert TypeORM entity to domain entity
   */
  private toDomainEntity(entity: UserProfileTypeOrmEntity): UserProfile {
    return new UserProfile({
      id: entity.id,
      userId: entity.userId,
      dateOfBirth: entity.dateOfBirth,
      bio: entity.bio,
      avatar: entity.avatar,
      address: entity.address,
      socialLinks: entity.socialLinks,
      preferences: entity.preferences,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
