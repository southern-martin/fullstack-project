import { DomainEvent } from '../../shared/kernel';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

export class UserRoleAssignedEvent extends DomainEvent {
  constructor(
    public readonly user: User,
    public readonly role: Role,
    public readonly assignedBy: number
  ) {
    super();
  }
}








