import { DomainEvent } from "@fullstack-project/shared-infrastructure";
import { User } from "../entities/user.entity";

export class UserUpdatedEvent extends DomainEvent {
  constructor(
    public readonly user: User,
    public readonly previousData: Partial<User>
  ) {
    super("UserUpdated");
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.user.id,
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      previousData: this.previousData,
    };
  }
}
