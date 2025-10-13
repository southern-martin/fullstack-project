import { DomainEvent } from '../../../../shared/kernel/domain-event';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly registeredAt: Date,
  ) {
    super();
  }
}
