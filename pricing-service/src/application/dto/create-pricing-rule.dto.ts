import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePricingRuleDto {
  @ApiProperty({ description: "Pricing rule name", example: "Standard Shipping Rate" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: "Rule description", example: "Standard rate for domestic shipping" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: "Whether rule is active", example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: "Pricing conditions",
    example: {
      carrierId: 1,
      serviceType: "STANDARD",
      weightRange: { min: 0, max: 50 },
      distanceRange: { min: 0, max: 1000 },
      originCountry: "USA",
      destinationCountry: "USA",
      customerType: "RETAIL",
    },
  })
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

  @ApiProperty({
    description: "Pricing details",
    example: {
      baseRate: 10.0,
      currency: "USD",
      perKgRate: 2.5,
      perKmRate: 0.5,
      minimumCharge: 5.0,
      maximumCharge: 500.0,
      surcharges: [{ type: "FUEL", percentage: 10 }],
      discounts: [{ type: "VOLUME", percentage: 5 }],
    },
  })
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

  @ApiPropertyOptional({ description: "Rule priority (higher = applied first)", example: 1 })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({ description: "Valid from date (ISO 8601)", example: "2024-01-01" })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiPropertyOptional({ description: "Valid to date (ISO 8601)", example: "2024-12-31" })
  @IsOptional()
  @IsDateString()
  validTo?: string;
}
