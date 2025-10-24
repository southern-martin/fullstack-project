// Role and Permission types for the admin interface

export interface Permission {
  id: number;
  name: string;
  description?: string;
  category: PermissionCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
  isActive: boolean;
  userCount?: number; // Number of users with this role
  createdAt: string;
  updatedAt: string;
}

export interface RoleFormData {
  name: string;
  description?: string;
  permissionIds: number[];
  isActive: boolean;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds?: number[];
  isActive?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissionIds?: number[];
  isActive?: boolean;
}

export interface AssignPermissionsRequest {
  permissionIds: number[];
}

export enum PermissionCategory {
  USERS = 'users',
  ROLES = 'roles',
  SYSTEM = 'system',
  CONTENT = 'content',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
  CARRIERS = 'carriers',
  CUSTOMERS = 'customers',
  PRICING = 'pricing',
}

export interface PermissionGroup {
  category: PermissionCategory;
  label: string;
  permissions: Permission[];
}

export interface RoleStats {
  totalRoles: number;
  activeRoles: number;
  inactiveRoles: number;
  totalPermissions: number;
  rolesWithUsers: number;
}
