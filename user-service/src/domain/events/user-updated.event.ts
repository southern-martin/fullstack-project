import { DomainEvent } from '../../shared/kernel';
import { User } from '../entities/user.entity';

export class UserUpdatedEvent extends DomainEvent {
  constructor(public readonly user: User, public readonly previousData: Partial<User>) {
    super();
  }
}








