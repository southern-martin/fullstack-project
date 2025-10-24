import { PermissionResponseDto } from './permission-response.dto';

export class RoleResponseDto {
  id: number;
  name: string;
  description: string;
  permissions: string[]; // Keep for backward compatibility
  permissionDetails?: PermissionResponseDto[]; // New field for detailed permission objects
  permissionsCount?: number; // New field for count
  usersCount?: number; // New field for users count
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
