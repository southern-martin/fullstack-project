import { Expose } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PricingRuleResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: "Standard Shipping Rate" })
  @Expose()
  name: string;

  @ApiProperty({ example: "Standard rate for domestic shipping" })
  @Expose()
  description: string;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    example: {
      carrierId: 1,
      serviceType: "STANDARD",
      weightRange: { min: 0, max: 50 },
      originCountry: "USA",
      destinationCountry: "USA",
    },
  })
  @Expose()
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
    example: {
      baseRate: 10.0,
      currency: "USD",
      perKgRate: 2.5,
      minimumCharge: 5.0,
    },
  })
  @Expose()
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

  @ApiProperty({ example: 1 })
  @Expose()
  priority: number;

  @ApiPropertyOptional({ example: "2024-01-01T00:00:00Z" })
  @Expose()
  validFrom: Date;

  @ApiPropertyOptional({ example: "2024-12-31T23:59:59Z" })
  @Expose()
  validTo: Date;

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: "2024-01-20T14:45:00Z" })
  @Expose()
  updatedAt: Date;
}
