import { IsOptional, IsEnum, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  SellerStatus,
  VerificationStatus,
} from '../../infrastructure/database/typeorm/entities/seller.entity';

export class SellerFilterDto {
  @IsOptional()
  @IsEnum(SellerStatus)
  status?: SellerStatus;

  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
