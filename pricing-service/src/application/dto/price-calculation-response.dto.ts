import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class PriceCalculationResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: "calc-123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  requestId: string;

  @ApiProperty({
    example: {
      carrierId: 1,
      serviceType: "STANDARD",
      weight: 25.5,
      distance: 500,
      originCountry: "USA",
      destinationCountry: "CAN",
    },
  })
  @Expose()
  request: {
    carrierId: number;
    serviceType: string;
    weight: number;
    distance?: number;
    originCountry: string;
    destinationCountry: string;
    customerType?: string;
    customerId?: number;
  };

  @ApiProperty({
    example: {
      baseRate: 10.0,
      weightRate: 63.75,
      distanceRate: 250.0,
      surcharges: [{ type: "FUEL", amount: 32.38, description: "Fuel surcharge 10%" }],
      discounts: [],
      subtotal: 323.75,
      total: 356.13,
      currency: "USD",
    },
  })
  @Expose()
  calculation: {
    baseRate: number;
    weightRate: number;
    distanceRate?: number;
    surcharges: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
    discounts: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
    subtotal: number;
    total: number;
    currency: string;
  };

  @ApiProperty({
    example: [
      { ruleId: 1, ruleName: "Standard Shipping Rate", priority: 1 },
    ],
  })
  @Expose()
  appliedRules: Array<{
    ruleId: number;
    ruleName: string;
    priority: number;
  }>;

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
  @Expose()
  calculatedAt: Date;

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
  @Expose()
  updatedAt: Date;
}







