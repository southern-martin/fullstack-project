import { UserProfile } from "@/domain/entities/user-profile.entity";
import { UserProfileRepositoryInterface } from "@/domain/repositories/user-profile.repository.interface";
import { Inject, Injectable } from "@nestjs/common";

/**
 * Get User Profile Use Case
 * Business logic for retrieving a user profile
 */
@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject("UserProfileRepositoryInterface")
    private readonly profileRepository: UserProfileRepositoryInterface
  ) {}

  async execute(userId: number): Promise<UserProfile | null> {
    return await this.profileRepository.findByUserId(userId);
  }
}
