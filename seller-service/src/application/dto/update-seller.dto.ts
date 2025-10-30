import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerDto } from './create-seller.dto';
import { IsOptional, IsNumber, IsString, MaxLength } from 'class-validator';

export class UpdateSellerDto extends PartialType(CreateSellerDto) {
  @IsOptional()
  @IsNumber()
  commissionRate?: number;
}

export class UpdateSellerProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  businessEmail?: string;

  @IsOptional()
  @IsString()
  businessPhone?: string;
}

export class UpdateBankingInfoDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  bankName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bankAccountHolder?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bankAccountNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  bankRoutingNumber?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
