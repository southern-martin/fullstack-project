import { User } from "../../../domain/entities/user.entity";

export class UserResponseDto {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: Record<string, any>;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  emailVerifiedAt?: Date;
  metadata?: Record<string, any>;
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
    this.password = user.password;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.isActive = user.isActive;
    this.isEmailVerified = user.isEmailVerified;
    this.dateOfBirth = user.dateOfBirth;
    this.address = user.address;
    this.preferences = user.preferences;
    this.lastLoginAt = user.lastLoginAt;
    this.passwordChangedAt = user.passwordChangedAt;
    this.emailVerifiedAt = user.emailVerifiedAt;
    this.metadata = user.metadata;
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
