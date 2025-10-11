import { IsNumber, IsOptional, IsString } from "class-validator";

export class CalculatePriceDto {
  @IsNumber()
  carrierId: number;

  @IsString()
  serviceType: string;

  @IsNumber()
  weight: number;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsString()
  originCountry: string;

  @IsString()
  destinationCountry: string;

  @IsOptional()
  @IsString()
  customerType?: string;

  @IsOptional()
  @IsNumber()
  customerId?: number;
}





