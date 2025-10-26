import { IsEmail, IsString, IsOptional, IsBoolean, IsDateString, IsArray, IsNumber, MinLength, MaxLength, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password (minimum 8 characters)', example: 'SecurePass123!', minLength: 8, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({ description: 'User first name', example: 'John', minLength: 2, maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe', minLength: 2, maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Whether the user is active', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({ description: 'Whether the email is verified', example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean = false;

  @ApiPropertyOptional({ description: 'User date of birth', example: '1990-01-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

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
  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @ApiPropertyOptional({ description: 'User preferences (JSON object)', example: { theme: 'dark', language: 'en' } })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Array of role IDs to assign to the user', example: [1, 2], type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds?: number[];
}








