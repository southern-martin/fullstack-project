import {
  IsBoolean,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCarrierDto {
  @ApiProperty({
    description: "Carrier name",
    example: "FedEx",
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: "Carrier description",
    example: "Global express shipping and logistics",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Whether the carrier is active",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: "Contact email address",
    example: "contact@fedex.com",
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({
    description: "Contact phone number",
    example: "+1-800-463-3339",
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    description: "Additional carrier metadata",
    example: {
      code: "FEDEX",
      website: "https://www.fedex.com",
      trackingUrl: "https://www.fedex.com/tracking",
      serviceTypes: ["EXPRESS", "GROUND", "FREIGHT"],
      coverage: ["US", "CA", "MX", "EU", "ASIA"],
      pricing: {
        baseRate: 10.5,
        currency: "USD",
        perKgRate: 2.5,
      },
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: {
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
}







