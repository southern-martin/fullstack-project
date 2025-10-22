import { CreateProfileRequest, UpdateProfileRequest, UserProfile } from '../../../shared/types';
import { userApiClient } from './userApiClient';

/**
 * ProfileApiService - Handles all user profile-related API calls
 * 
 * Endpoints:
 * - GET /profiles/:userId - Get profile by user ID
 * - POST /profiles/:userId - Create profile for user
 * - PATCH /profiles/:userId - Update profile
 * - DELETE /profiles/:userId - Delete profile
 */
class ProfileApiService {
  private readonly basePath: string = '/profiles';

  /**
   * Get user profile by user ID
   */
  async getProfileByUserId(userId: number): Promise<UserProfile | null> {
    try {
      const response = await userApiClient.get<{
        data: {
          success: boolean;
          message: string;
          data: UserProfile;
        };
        message: string;
        statusCode: number;
      }>(`${this.basePath}/${userId}`);

      // Handle "Profile not found" case (check the message field in the nested data)
      const responseData = response.data as any;
      if (responseData?.data?.message === 'Profile not found') {
        return null;
      }

      // The response structure is: response.data.data.data
      // First .data is from axios, second .data is from our API wrapper, third .data is the actual profile
      if (responseData?.data?.data) {
        return responseData.data.data;
      }

      // Fallback to direct data access
      if (responseData?.data) {
        return responseData.data;
      }

      return null;
    } catch (error: any) {
      // Return null if profile doesn't exist (404 or "not found" message)
      if (error.response?.status === 404 || error.response?.data?.data?.message === 'Profile not found') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new profile for a user
   */
  async createProfile(userId: number, data: CreateProfileRequest): Promise<UserProfile> {
    const response = await userApiClient.post<{
      data: {
        success: boolean;
        message: string;
        data: UserProfile;
      };
      message: string;
      statusCode: number;
    }>(`${this.basePath}/${userId}`, data);

    // Handle nested response structure
    const responseData = response.data as any;
    if (responseData?.data?.data) {
      return responseData.data.data;
    }
    if (responseData?.data) {
      return responseData.data;
    }
    
    return response.data.data;
  }

  /**
   * Update an existing profile
   */
  async updateProfile(userId: number, data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await userApiClient.patch<{
      data: {
        success: boolean;
        message: string;
        data: UserProfile;
      };
      message: string;
      statusCode: number;
    }>(`${this.basePath}/${userId}`, data);

    // Handle nested response structure
    const responseData = response.data as any;
    if (responseData?.data?.data) {
      return responseData.data.data;
    }
    if (responseData?.data) {
      return responseData.data;
    }

    return response.data.data;
  }

  /**
   * Delete a user profile
   */
  async deleteProfile(userId: number): Promise<void> {
    await userApiClient.delete(`${this.basePath}/${userId}`);
  }

  /**
   * Create or update profile (upsert)
   * Tries to update first, if not found, creates new profile
   */
  async upsertProfile(userId: number, data: CreateProfileRequest | UpdateProfileRequest): Promise<UserProfile> {
    try {
      // Try to update first
      return await this.updateProfile(userId, data);
    } catch (error: any) {
      // If profile doesn't exist, create it
      if (error.response?.status === 404 || error.response?.data?.data?.message === 'Profile not found') {
        return await this.createProfile(userId, data);
      }
      throw error;
    }
  }
}

export const profileApiService = new ProfileApiService();
