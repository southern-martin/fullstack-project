import { BaseEntity } from "typeorm";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { UserRoleTypeOrmEntity } from "./user-role.typeorm.entity";

/**
 * User TypeORM Entity
 *
 * This entity represents the database table structure for users.
 * It's separate from the domain entity to maintain Clean Architecture principles.
 */
@Entity("users")
@Index(["email"], { unique: true })
@Index(["isActive"])
@Index(["createdAt"])
export class UserTypeOrmEntity extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "date", nullable: true })
  dateOfBirth: Date;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: "json", nullable: true })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Column({ type: "json", nullable: true })
  preferences: Record<string, any>;

  @Column({ type: "timestamp", nullable: true })
  lastLoginAt: Date;

  @Column({ type: "timestamp", nullable: true })
  emailVerifiedAt: Date;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  // Relations
  @OneToMany(() => UserRoleTypeOrmEntity, (userRole) => userRole.user)
  userRoles: UserRoleTypeOrmEntity[];
}
