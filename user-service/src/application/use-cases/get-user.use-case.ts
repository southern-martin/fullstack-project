import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { UserResponseDto } from "../dtos/user-response.dto";
import { PaginationDto } from "../../../shared/dto";

/**
 * Get User Use Case
 * Application service that orchestrates the user retrieval process
 * Follows Clean Architecture principles
 */
@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface
  ) {}

  /**
   * Executes the get user by ID use case
   * @param id - User ID
   * @returns User response
   */
  async executeById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.mapToResponseDto(user);
  }

  /**
   * Executes the get user by email use case
   * @param email - User email
   * @returns User response
   */
  async executeByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.mapToResponseDto(user);
  }

  /**
   * Executes the get all users use case
   * @param paginationDto - Pagination parameters
   * @param search - Search term
   * @returns Users and pagination info
   */
  async executeAll(
    paginationDto: PaginationDto,
    search?: string
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    const { users, total } = search 
      ? await this.userRepository.search(search, paginationDto)
      : await this.userRepository.findAll(paginationDto);

    return {
      users: users.map((user) => this.mapToResponseDto(user)),
      total,
    };
  }

  /**
   * Executes the get active users use case
   * @returns Active users
   */
  async executeActive(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findActive();
    return users.map((user) => this.mapToResponseDto(user));
  }

  /**
   * Executes the get user count use case
   * @returns User count
   */
  async executeCount(): Promise<{ count: number }> {
    const count = await this.userRepository.count();
    return { count };
  }

  /**
   * Executes the check if user exists by email use case
   * @param email - User email
   * @returns Existence check result
   */
  async executeExistsByEmail(email: string): Promise<{ exists: boolean }> {
    const user = await this.userRepository.findByEmail(email);
    return { exists: !!user };
  }

  /**
   * Executes the get users by role use case
   * @param roleName - Role name
   * @returns Users with the specified role
   */
  async executeByRole(roleName: string): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    const usersWithRole = users.filter((user) => user.hasRole(roleName));
    return usersWithRole.map((user) => this.mapToResponseDto(user));
  }

  /**
   * Maps user entity to response DTO
   * @param user - User entity
   * @returns User response DTO
   */
  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      preferences: user.preferences,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
