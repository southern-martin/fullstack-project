import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsUrl,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BusinessType } from '../../infrastructure/database/typeorm/entities/seller.entity';

export class CreateSellerDto {
  // userId is extracted from JWT token in the controller, not from request body
  @ApiPropertyOptional({ description: 'User ID (extracted from JWT token)' })
  @IsOptional()
  userId?: number;

  @ApiProperty({ description: 'Business name', example: 'My Business LLC', minLength: 2, maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  businessName: string;

  @ApiProperty({ description: 'Business type', enum: BusinessType, example: BusinessType.LLC })
  @IsEnum(BusinessType)
  @IsNotEmpty()
  businessType: BusinessType;

  @ApiProperty({ description: 'Business email address', example: 'business@example.com' })
  @IsEmail()
  @IsNotEmpty()
  businessEmail: string;

  @ApiProperty({ description: 'Business phone number', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\d\s\-\+\(\)]+$/, {
    message: 'Business phone must be a valid phone number',
  })
  businessPhone: string;

  @ApiPropertyOptional({ description: 'Tax identification number', example: '12-3456789', minLength: 5, maxLength: 100 })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(100)
  taxId?: string;

  @ApiProperty({ description: 'Business street address', example: '123 Main St', maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  businessAddress: string;

  @ApiProperty({ description: 'Business city', example: 'New York', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  businessCity: string;

  @ApiProperty({ description: 'Business state/province', example: 'NY', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  businessState: string;

  @ApiProperty({ description: 'Business country', example: 'USA', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  businessCountry: string;

  @ApiPropertyOptional({ description: 'Business postal code', example: '10001', maxLength: 20 })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  businessPostalCode?: string;

  @ApiPropertyOptional({ description: 'Logo URL', example: 'https://example.com/logo.png' })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Business description', example: 'We provide quality services', maxLength: 2000 })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ description: 'Business website', example: 'https://example.com' })
  @IsUrl()
  @IsOptional()
  website?: string;

  // Banking Information (optional during registration)
  @ApiPropertyOptional({ description: 'Bank name', example: 'Example Bank', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bankName?: string;

  @ApiPropertyOptional({ description: 'Bank account holder name', example: 'John Doe', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bankAccountHolder?: string;

  @ApiPropertyOptional({ description: 'Bank account number', example: '1234567890', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bankAccountNumber?: string;

  @ApiPropertyOptional({ description: 'Bank routing number', example: '987654321', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  bankRoutingNumber?: string;

  @ApiPropertyOptional({ description: 'Payment method', example: 'bank_transfer' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
