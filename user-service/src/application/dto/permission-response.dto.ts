/**
 * Permission Response DTO
 * Data Transfer Object for permission responses
 */
export class PermissionResponseDto {
  id: number;
  name: string;
  description?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
