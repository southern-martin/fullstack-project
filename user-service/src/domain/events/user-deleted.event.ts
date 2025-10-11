import { DomainEvent } from '../../shared/kernel';
import { User } from '../entities/user.entity';

export class UserDeletedEvent extends DomainEvent {
  constructor(public readonly userId: number, public readonly userEmail: string) {
    super();
  }
}






