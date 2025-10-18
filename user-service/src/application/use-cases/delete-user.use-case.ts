import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EventBusInterface } from "../../domain/events/event-bus.interface";
import { UserDeletedEvent } from "../../domain/events/user-deleted.event";
import { UserRepositoryInterface } from "../../domain/repositories/user.repository.interface";
import { UserDomainService } from "../../domain/services/user.domain.service";

/**
 * Delete User Use Case
 * Application service that orchestrates the user deletion process
 * Follows Clean Architecture principles
 */
@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepository: UserRepositoryInterface,
    @Inject("UserDomainService")
    private readonly userDomainService: UserDomainService,
    @Inject("EventBusInterface")
    private readonly eventBus: EventBusInterface
  ) {}

  /**
   * Executes the delete user use case
   * @param id - User ID
   */
  async execute(id: number): Promise<void> {
    // 1. Find existing user
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    // 2. Check if user can be deleted (business rule)
    // Note: In a real application, you would check for related data
    // For now, we'll assume we can delete if no associated data
    const hasAnyData = false; // This would come from other services

    if (!this.userDomainService.canDeleteUser(existingUser, hasAnyData)) {
      throw new BadRequestException("Cannot delete user with associated data");
    }

    // 3. Store user info for event
    const userEmail = existingUser.email;

    // 4. Delete user from repository
    await this.userRepository.delete(id);

    // 5. Publish domain event
    await this.eventBus.publish(new UserDeletedEvent(id, userEmail));
  }
}
