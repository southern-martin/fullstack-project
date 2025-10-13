import { Injectable } from "@nestjs/common";
import { EventBusService } from "../../../../shared/services/event-bus.service";
import { UserLogoutEvent } from "../../domain/events/user-logout.event";

/**
 * LogoutUseCase
 *
 * This use case handles user logout.
 * It orchestrates the domain logic and publishes logout events.
 */
@Injectable()
export class LogoutUseCase {
  constructor(private readonly eventBusService: EventBusService) {}

  /**
   * Executes the logout use case.
   * @param userId The user ID.
   * @param email The user email.
   * @param sessionStartTime Optional session start time for duration calculation.
   */
  async execute(
    userId: number,
    email: string,
    sessionStartTime?: Date
  ): Promise<void> {
    // 1. Calculate session duration if start time is provided
    let sessionDuration: number | undefined;
    if (sessionStartTime) {
      const now = new Date();
      sessionDuration = Math.round(
        (now.getTime() - sessionStartTime.getTime()) / (1000 * 60)
      ); // in minutes
    }

    // 2. Publish domain event
    const logoutEvent = new UserLogoutEvent(
      userId,
      email,
      new Date(),
      sessionDuration
    );
    await this.eventBusService.publish(logoutEvent);

    // Note: In a real application, you might want to:
    // - Add the token to a blacklist
    // - Update user's last logout time
    // - Clear any server-side session data
    // - Send notifications to other devices
  }
}
