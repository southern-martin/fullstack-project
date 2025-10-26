import { Expose } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CustomerResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: "john.doe@example.com" })
  @Expose()
  email: string;

  @ApiProperty({ example: "John" })
  @Expose()
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @Expose()
  lastName: string;

  @ApiPropertyOptional({ example: "+1-555-0100" })
  @Expose()
  phone: string;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiPropertyOptional({ example: "1990-01-15T00:00:00Z" })
  @Expose()
  dateOfBirth: Date;

  @ApiPropertyOptional({
    example: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  })
  @Expose()
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @ApiPropertyOptional({
    example: {
      company: "Acme Corp",
      industry: "Technology",
      preferredContact: "email",
      newsletter: true,
    },
  })
  @Expose()
  preferences: {
    company?: string;
    industry?: string;
    preferredContact?: string;
    newsletter?: boolean;
  };

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: "2024-01-20T14:45:00Z" })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ example: "John Doe" })
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
