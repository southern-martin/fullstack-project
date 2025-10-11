import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("roles")
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "json", nullable: true })
  permissions: string[];

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  // Domain methods for business logic
  hasPermission(permission: string): boolean {
    return (
      this.permissions?.includes(permission) || this.permissions?.includes("*")
    );
  }

  isSystemRole(): boolean {
    return ["user", "admin", "super_admin"].includes(this.name);
  }

  canBeDeleted(): boolean {
    return !this.isSystemRole();
  }
}





