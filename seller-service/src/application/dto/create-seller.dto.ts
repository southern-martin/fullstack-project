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
import { BusinessType } from '../../infrastructure/database/typeorm/entities/seller.entity';

export class CreateSellerDto {
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  businessName: string;

  @IsEnum(BusinessType)
  @IsOptional()
  businessType?: BusinessType;

  @IsEmail()
  @IsOptional()
  businessEmail?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[\d\s\-\+\(\)]+$/, {
    message: 'Business phone must be a valid phone number',
  })
  businessPhone?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(100)
  taxId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  businessAddress?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  businessCity?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  businessState?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  businessCountry?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  businessPostalCode?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  // Banking Information (optional during registration)
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bankName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  bankAccountHolder?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  bankAccountNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  bankRoutingNumber?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
