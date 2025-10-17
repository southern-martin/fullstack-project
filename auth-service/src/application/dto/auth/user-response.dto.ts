import { User } from "../../../domain/entities/user.entity";

export class UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  roles: {
    id: number;
    name: string;
    description?: string;
    permissions?: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.isActive = user.isActive;
    this.isEmailVerified = user.isEmailVerified;
    this.lastLoginAt = user.lastLoginAt;
    this.passwordChangedAt = user.passwordChangedAt;
    this.roles =
      user.roles?.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      })) || [];
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
