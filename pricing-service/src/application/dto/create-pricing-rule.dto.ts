import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreatePricingRuleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsObject()
  conditions: {
    carrierId?: number;
    serviceType?: string;
    weightRange?: {
      min: number;
      max: number;
    };
    distanceRange?: {
      min: number;
      max: number;
    };
    originCountry?: string;
    destinationCountry?: string;
    customerType?: string;
  };

  @IsObject()
  pricing: {
    baseRate: number;
    currency: string;
    perKgRate?: number;
    perKmRate?: number;
    minimumCharge?: number;
    maximumCharge?: number;
    surcharges?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
    discounts?: Array<{
      type: string;
      amount?: number;
      percentage?: number;
    }>;
  };

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validTo?: string;
}
