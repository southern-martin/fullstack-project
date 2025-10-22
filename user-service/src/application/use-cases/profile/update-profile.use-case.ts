import { UserProfile } from "@/domain/entities/user-profile.entity";
import { UserProfileRepositoryInterface } from "@/domain/repositories/user-profile.repository.interface";
import { Inject, Injectable } from "@nestjs/common";

/**
 * Update User Profile Use Case
 * Business logic for updating an existing user profile
 */
@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject("UserProfileRepositoryInterface")
    private readonly profileRepository: UserProfileRepositoryInterface
  ) {}

  async execute(
    userId: number,
    data: Partial<UserProfile>
  ): Promise<UserProfile> {
    // Find profile by user ID
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new Error("Profile not found for this user");
    }

    // Update profile
    return await this.profileRepository.update(profile.id!, data);
  }
}
