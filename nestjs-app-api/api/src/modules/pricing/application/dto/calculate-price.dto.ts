import { IsNumber, IsOptional, IsString, IsObject, Min } from 'class-validator';

export class CalculatePriceDto {
  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsString()
  customerType?: string;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsString()
  productCategory?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orderValue?: number;

  @IsOptional()
  @IsObject()
  additionalData?: Record<string, any>;
}
