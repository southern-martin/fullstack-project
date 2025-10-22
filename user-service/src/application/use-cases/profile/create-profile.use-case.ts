import { UserProfile } from "@/domain/entities/user-profile.entity";
import { UserProfileRepositoryInterface } from "@/domain/repositories/user-profile.repository.interface";
import { Inject, Injectable } from "@nestjs/common";

/**
 * Create User Profile Use Case
 * Business logic for creating a new user profile
 */
@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject("UserProfileRepositoryInterface")
    private readonly profileRepository: UserProfileRepositoryInterface
  ) {}

  async execute(userId: number, data: Partial<UserProfile>): Promise<UserProfile> {
    // Check if profile already exists
    const existing = await this.profileRepository.findByUserId(userId);
    if (existing) {
      throw new Error("Profile already exists for this user");
    }

    // Create new profile
    const profile = new UserProfile({
      userId,
      ...data,
    });

    return await this.profileRepository.create(profile);
  }
}
