import { BaseEntity } from "@shared/infrastructure";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { RoleTypeOrmEntity } from "./role.typeorm.entity";
import { UserTypeOrmEntity } from "./user.typeorm.entity";

/**
 * UserRole TypeORM Entity
 *
 * This entity represents the many-to-many relationship between users and roles.
 * It includes additional metadata about the role assignment.
 */
@Entity("user_roles")
@Index(["userId", "roleId"], { unique: true })
@Index(["assignedAt"])
@Index(["assignedBy"])
export class UserRoleTypeOrmEntity extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  roleId: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  assignedAt: Date;

  @Column({ nullable: true })
  assignedBy: number;

  @Column({ type: "timestamp", nullable: true })
  expiresAt: Date;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  // Relations
  @ManyToOne(() => UserTypeOrmEntity, (user) => user.userRoles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: UserTypeOrmEntity;

  @ManyToOne(() => RoleTypeOrmEntity, (role) => role.userRoles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "roleId" })
  role: RoleTypeOrmEntity;
}
