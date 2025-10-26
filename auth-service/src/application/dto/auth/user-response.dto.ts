import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "../../../domain/entities/user.entity";

export class UserResponseDto {
  @ApiProperty({
    description: "User unique identifier",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
  })
  email: string;

  @ApiProperty({
    description: "User first name",
    example: "John",
  })
  firstName: string;

  @ApiProperty({
    description: "User last name",
    example: "Doe",
  })
  lastName: string;

  @ApiPropertyOptional({
    description: "User phone number",
    example: "+1234567890",
  })
  phone?: string;

  @ApiProperty({
    description: "User account active status",
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "Email verification status",
    example: true,
  })
  isEmailVerified: boolean;

  @ApiPropertyOptional({
    description: "Last login timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  lastLoginAt?: Date;

  @ApiPropertyOptional({
    description: "Password last changed timestamp",
    example: "2024-01-01T08:00:00.000Z",
  })
  passwordChangedAt?: Date;

  @ApiProperty({
    description: "User roles and permissions",
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        name: { type: "string", example: "Admin" },
        description: { type: "string", example: "Administrator role" },
        permissions: {
          type: "array",
          items: { type: "string" },
          example: ["users:read", "users:write"],
        },
      },
    },
  })
  roles: {
    id: number;
    name: string;
    description?: string;
    permissions?: string[];
  }[];

  @ApiProperty({
    description: "User creation timestamp",
    example: "2024-01-01T00:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "User last update timestamp",
    example: "2024-01-15T12:00:00.000Z",
  })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.isActive = user.isActive;
    this.isEmailVerified = user.isEmailVerified;
    this.lastLoginAt = user.lastLoginAt;
    this.passwordChangedAt = user.passwordChangedAt;
    this.roles =
      user.roles?.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      })) || [];
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
