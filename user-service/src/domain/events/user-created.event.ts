import { DomainEvent } from "@shared/infrastructure";
import { User } from "../entities/user.entity";

export class UserCreatedEvent extends DomainEvent {
  constructor(public readonly user: User) {
    super("UserCreated");
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.user.id,
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
    };
  }
}
