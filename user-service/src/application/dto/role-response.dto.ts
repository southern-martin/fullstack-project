import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PermissionResponseDto } from "./permission-response.dto";

export class RoleResponseDto {
  @ApiProperty({ description: "Role ID", example: 1 })
  id: number;

  @ApiProperty({ description: "Role name", example: "admin" })
  name: string;

  @ApiProperty({
    description: "Role description",
    example: "Administrator role with full access",
  })
  description: string;

  @ApiProperty({
    description: "Array of permission names",
    example: ["users.read", "users.write"],
    type: [String],
  })
  permissions: string[]; // Array of permission names from relational system (permissionEntities)

  @ApiPropertyOptional({
    description: "Detailed permission objects",
    type: [PermissionResponseDto],
  })
  permissionDetails?: PermissionResponseDto[]; // Detailed permission objects with categories

  @ApiPropertyOptional({
    description: "Count of permissions assigned to this role",
    example: 5,
  })
  permissionsCount?: number; // Count of permissions assigned to this role

  @ApiPropertyOptional({
    description: "Count of users with this role",
    example: 10,
  })
  usersCount?: number; // Count of users with this role

  @ApiProperty({ description: "Whether the role is active", example: true })
  isActive: boolean;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-10-26T10:30:00Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-10-26T10:30:00Z",
  })
  updatedAt: Date;
}
