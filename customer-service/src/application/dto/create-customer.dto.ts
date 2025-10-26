import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCustomerDto {
  @ApiProperty({ description: "Customer email address", example: "john.doe@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "First name", example: "John" })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "Last name", example: "Doe" })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: "Phone number", example: "+1-555-0100" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: "Whether customer is active", example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: "Date of birth (ISO 8601)", example: "1990-01-15" })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: "Customer address",
    example: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  })
  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @ApiPropertyOptional({
    description: "Customer preferences",
    example: {
      company: "Acme Corp",
      industry: "Technology",
      preferredContact: "email",
      newsletter: true,
    },
  })
  @IsOptional()
  @IsObject()
  preferences?: {
    company?: string;
    industry?: string;
    preferredContact?: string;
    newsletter?: boolean;
  };
}







