import { Exclude, Expose, Type } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone?: string;

  @Expose()
  isActive: boolean;

  @Expose()
  isEmailVerified: boolean;

  @Expose()
  dateOfBirth?: Date;

  @Expose()
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Expose()
  preferences?: Record<string, any>;

  @Expose()
  lastLoginAt?: Date;

  @Expose()
  passwordChangedAt?: Date;

  @Expose()
  @Type(() => RoleResponseDto)
  roles: RoleResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

export class RoleResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  isActive: boolean;

  @Expose()
  permissions?: string[];

  @Expose()
  metadata?: Record<string, any>;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}


