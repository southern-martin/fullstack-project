import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Role } from "./role.entity";

@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: "date", nullable: true })
  dateOfBirth: Date;

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
  passwordChangedAt: Date;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "roleId", referencedColumnName: "id" },
  })
  roles: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  hasRole(roleName: string): boolean {
    return this.roles?.some((role) => role.name === roleName) || false;
  }

  hasPermission(permission: string): boolean {
    return (
      this.roles?.some((role) => role.permissions?.includes(permission)) ||
      false
    );
  }

  isAdmin(): boolean {
    return this.hasRole("admin") || this.hasRole("super_admin");
  }

  canManageUsers(): boolean {
    return this.hasPermission("users.manage") || this.isAdmin();
  }

  // Domain methods for business logic
  canLogin(): boolean {
    return this.isActive && this.isEmailVerified;
  }

  updateLastLogin(): void {
    this.lastLoginAt = new Date();
  }

  updatePasswordChange(): void {
    this.passwordChangedAt = new Date();
  }
}


