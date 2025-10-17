import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { RoleRepositoryInterface } from "../../domain/repositories/role.repository.interface";

/**
 * Delete Role Use Case
 * Application service that orchestrates the role deletion process
 * Follows Clean Architecture principles
 */
@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface
  ) {}

  /**
   * Executes the delete role use case
   * @param id - Role ID
   */
  async execute(id: number): Promise<void> {
    // 1. Find existing role
    const existingRole = await this.roleRepository.findById(id);
    if (!existingRole) {
      throw new NotFoundException("Role not found");
    }

    // 2. Check if role can be deleted (business rule)
    // Note: In a real application, you would check if role is assigned to users
    // For now, we'll assume we can delete if not assigned to users
    const isAssignedToUsers = false; // This would come from user repository

    if (isAssignedToUsers) {
      throw new BadRequestException(
        "Cannot delete role that is assigned to users"
      );
    }

    // 3. Delete role from repository
    await this.roleRepository.delete(id);
  }
}
