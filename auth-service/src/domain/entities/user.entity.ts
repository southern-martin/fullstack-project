import { Role } from "./role.entity";

export class User {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  roles: Role[];

  constructor(data: Partial<User> = {}) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.email = data.email || "";
    this.password = data.password || "";
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.phone = data.phone;
    this.isActive = data.isActive ?? true;
    this.isEmailVerified = data.isEmailVerified ?? false;
    this.lastLoginAt = data.lastLoginAt;
    this.passwordChangedAt = data.passwordChangedAt;
    this.roles = data.roles || [];
  }

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
}
