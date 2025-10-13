import { DomainEvent } from '../../../../shared/kernel/domain-event';

export class UserLoggedInEvent extends DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly loginAt: Date,
    public readonly ipAddress?: string,
    public readonly userAgent?: string,
  ) {
    super();
  }
}
