import { DomainEvent } from "../../../../shared/kernel/domain-event";

export class UserLogoutEvent extends DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly logoutAt: Date,
    public readonly sessionDuration?: number // in minutes
  ) {
    super();
  }
}
