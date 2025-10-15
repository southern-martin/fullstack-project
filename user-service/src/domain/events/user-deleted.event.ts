import { DomainEvent } from "@shared/infrastructure";

export class UserDeletedEvent extends DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly userEmail: string
  ) {
    super("UserDeleted");
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.userId,
      userEmail: this.userEmail,
    };
  }
}
