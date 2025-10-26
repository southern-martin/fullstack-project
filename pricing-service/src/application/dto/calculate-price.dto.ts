import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CalculatePriceDto {
  @ApiProperty({ description: "Carrier ID", example: 1 })
  @IsNumber()
  carrierId: number;

  @ApiProperty({ description: "Service type", example: "STANDARD" })
  @IsString()
  serviceType: string;

  @ApiProperty({ description: "Package weight in kg", example: 25.5 })
  @IsNumber()
  weight: number;

  @ApiPropertyOptional({ description: "Distance in km", example: 500 })
  @IsOptional()
  @IsNumber()
  distance?: number;

  @ApiProperty({ description: "Origin country code", example: "USA" })
  @IsString()
  originCountry: string;

  @ApiProperty({ description: "Destination country code", example: "CAN" })
  @IsString()
  destinationCountry: string;

  @ApiPropertyOptional({ description: "Customer type", example: "RETAIL" })
  @IsOptional()
  @IsString()
  customerType?: string;

  @ApiPropertyOptional({ description: "Customer ID", example: 123 })
  @IsOptional()
  @IsNumber()
  customerId?: number;
}







