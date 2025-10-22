import { UserProfile } from "../entities/user-profile.entity";

/**
 * UserProfile Repository Interface
 * Defines contract for user profile data access
 */
export interface UserProfileRepositoryInterface {
  /**
   * Create a new user profile
   */
  create(profile: UserProfile): Promise<UserProfile>;

  /**
   * Find profile by ID
   */
  findById(id: number): Promise<UserProfile | null>;

  /**
   * Find profile by user ID
   */
  findByUserId(userId: number): Promise<UserProfile | null>;

  /**
   * Update existing profile
   */
  update(id: number, profile: Partial<UserProfile>): Promise<UserProfile>;

  /**
   * Delete profile
   */
  delete(id: number): Promise<void>;

  /**
   * Check if profile exists for user
   */
  existsByUserId(userId: number): Promise<boolean>;
}
