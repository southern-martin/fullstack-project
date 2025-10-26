import { Expose } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CarrierResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: "FedEx" })
  @Expose()
  name: string;

  @ApiProperty({ example: "Global express shipping and logistics" })
  @Expose()
  description: string;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: "contact@fedex.com" })
  @Expose()
  contactEmail: string;

  @ApiProperty({ example: "+1-800-463-3339" })
  @Expose()
  contactPhone: string;

  @ApiPropertyOptional({
    example: {
      code: "FEDEX",
      website: "https://www.fedex.com",
      trackingUrl: "https://www.fedex.com/tracking",
      serviceTypes: ["EXPRESS", "GROUND"],
      coverage: ["US", "CA", "EU"],
      pricing: { baseRate: 10.5, currency: "USD", perKgRate: 2.5 },
    },
  })
  @Expose()
  metadata: {
    code?: string;
    website?: string;
    trackingUrl?: string;
    serviceTypes?: string[];
    coverage?: string[];
    pricing?: {
      baseRate?: number;
      currency?: string;
      perKgRate?: number;
    };
  };

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: "2024-01-20T14:45:00Z" })
  @Expose()
  updatedAt: Date;
}







