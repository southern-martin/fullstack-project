import { Exclude, Expose, Type } from 'class-transformer';
import { RoleResponseDto } from './role-response.dto';

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









