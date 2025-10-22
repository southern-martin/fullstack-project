import { UserProfileRepositoryInterface } from "@/domain/repositories/user-profile.repository.interface";
import { Inject, Injectable } from "@nestjs/common";

/**
 * Delete User Profile Use Case
 * Business logic for deleting a user profile
 */
@Injectable()
export class DeleteProfileUseCase {
  constructor(
    @Inject("UserProfileRepositoryInterface")
    private readonly profileRepository: UserProfileRepositoryInterface
  ) {}

  async execute(userId: number): Promise<void> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new Error("Profile not found for this user");
    }

    await this.profileRepository.delete(profile.id!);
  }
}
