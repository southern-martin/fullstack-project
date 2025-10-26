import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleResponseDto } from './role-response.dto';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @Expose()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @Expose()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @Expose()
  lastName: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
  @Expose()
  phone?: string;

  @ApiProperty({ description: 'Whether the user is active', example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ description: 'Whether the email is verified', example: false })
  @Expose()
  isEmailVerified: boolean;

  @ApiPropertyOptional({ description: 'User date of birth', example: '1990-01-15T00:00:00Z' })
  @Expose()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ 
    description: 'User address',
    example: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  })
  @Expose()
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @ApiPropertyOptional({ description: 'User preferences', example: { theme: 'dark', language: 'en' } })
  @Expose()
  preferences?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Last login timestamp', example: '2024-10-26T10:30:00Z' })
  @Expose()
  lastLoginAt?: Date;

  @ApiPropertyOptional({ description: 'Password last changed timestamp', example: '2024-10-26T10:30:00Z' })
  @Expose()
  passwordChangedAt?: Date;

  @ApiProperty({ description: 'User roles', type: [RoleResponseDto] })
  @Expose()
  @Type(() => RoleResponseDto)
  roles: RoleResponseDto[];

  @ApiProperty({ description: 'Creation timestamp', example: '2024-10-26T10:30:00Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp', example: '2024-10-26T10:30:00Z' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}









