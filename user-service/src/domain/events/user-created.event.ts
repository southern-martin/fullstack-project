import { DomainEvent } from '../../shared/kernel';
import { User } from '../entities/user.entity';

export class UserCreatedEvent extends DomainEvent {
  constructor(public readonly user: User) {
    super();
  }
}






