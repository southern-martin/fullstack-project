import { IsBoolean, IsDateString, IsEnum, IsInt, IsObject, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreatePricingRuleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['PERCENTAGE', 'FIXED_AMOUNT', 'QUANTITY_BREAK', 'CUSTOMER_TYPE', 'DATE_RANGE', 'COMPOSITE'])
  ruleType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'QUANTITY_BREAK' | 'CUSTOMER_TYPE' | 'DATE_RANGE' | 'COMPOSITE';

  @IsObject()
  conditions: {
    customerType?: string[];
    minQuantity?: number;
    maxQuantity?: number;
    startDate?: Date;
    endDate?: Date;
    productCategories?: string[];
    regions?: string[];
    [key: string]: any;
  };

  @IsObject()
  actions: {
    type: 'DISCOUNT' | 'MARKUP' | 'SET_PRICE' | 'FREE_SHIPPING';
    value: number;
    maxDiscount?: number;
    minOrderValue?: number;
    [key: string]: any;
  };

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  priority?: number = 0;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
