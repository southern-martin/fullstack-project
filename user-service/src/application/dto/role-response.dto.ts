import { PermissionResponseDto } from './permission-response.dto';

export class RoleResponseDto {
  id: number;
  name: string;
  description: string;
  permissions: string[]; // Array of permission names from relational system (permissionEntities)
  permissionDetails?: PermissionResponseDto[]; // Detailed permission objects with categories
  permissionsCount?: number; // Count of permissions assigned to this role
  usersCount?: number; // Count of users with this role
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
