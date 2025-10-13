import { DomainEvent } from "@shared/infrastructure";
import { Role } from "../entities/role.entity";
import { User } from "../entities/user.entity";

export class UserRoleAssignedEvent extends DomainEvent {
  constructor(
    public readonly user: User,
    public readonly role: Role,
    public readonly assignedBy: number
  ) {
    super("UserRoleAssigned");
  }

  getEventData(): Record<string, any> {
    return {
      userId: this.user.id,
      userEmail: this.user.email,
      roleId: this.role.id,
      roleName: this.role.name,
      assignedBy: this.assignedBy,
    };
  }
}
