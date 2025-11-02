import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

/**
 * User Permission Service
 *
 * Focused service for user permission and role management.
 * Follows Single Responsibility Principle - only handles permissions.
 *
 * Business Rules:
 * - Manages user role assignments
 * - Handles permission checking
 * - Validates role constraints
 */
export class UserPermissionService {
  /**
   * Determines if user has specific role
   * @returns Whether user has the role
   */
  hasRole(user: User, roleName: string): boolean {
    return user.roles?.some((role) => role.name === roleName && role.isActive) || false;
  }

  /**
   * Determines if user has any of the specified roles
   * @returns Whether user has any of the roles
   */
  hasAnyRole(user: User, roleNames: string[]): boolean {
    return roleNames.some((roleName) => this.hasRole(user, roleName));
  }

  /**
   * Determines if user has all of the specified roles
   * @returns Whether user has all of the roles
   */
  hasAllRoles(user: User, roleNames: string[]): boolean {
    return roleNames.every((roleName) => this.hasRole(user, roleName));
  }

  /**
   * Determines if user has specific permission
   * @returns Whether user has the permission
   */
  hasPermission(user: User, permission: string): boolean {
    return user.roles?.some((role) => role.permissions?.includes(permission)) || false;
  }

  /**
   * Determines if user has any of the specified permissions
   * @returns Whether user has any of the permissions
   */
  hasAnyPermission(user: User, permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(user, permission));
  }

  /**
   * Determines if user has all of the specified permissions
   * @returns Whether user has all of the permissions
   */
  hasAllPermissions(user: User, permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(user, permission));
  }

  /**
   * Determines if user is admin
   * @returns Whether user is admin
   */
  isAdmin(user: User): boolean {
    return this.hasRole(user, 'admin') || this.hasRole(user, 'super_admin');
  }

  /**
   * Determines if user is super admin
   * @returns Whether user is super admin
   */
  isSuperAdmin(user: User): boolean {
    return this.hasRole(user, 'super_admin');
  }

  /**
   * Determines if user is moderator
   * @returns Whether user is moderator
   */
  isModerator(user: User): boolean {
    return this.hasAnyRole(user, ['moderator', 'admin', 'super_admin']);
  }

  /**
   * Determines if user can manage other users
   * @returns Whether user can manage users
   */
  canManageUsers(user: User): boolean {
    return (
      this.hasPermission(user, 'users.manage') ||
      this.hasAnyPermission(user, ['users.create', 'users.update', 'users.delete']) ||
      this.isAdmin(user)
    );
  }

  /**
   * Determines if user can manage roles
   * @returns Whether user can manage roles
   */
  canManageRoles(user: User): boolean {
    return (
      this.hasPermission(user, 'roles.manage') ||
      this.hasAnyPermission(user, ['roles.create', 'roles.update', 'roles.delete']) ||
      this.isSuperAdmin(user)
    );
  }

  /**
   * Determines if user can manage system settings
   * @returns Whether user can manage system settings
   */
  canManageSystem(user: User): boolean {
    return (
      this.hasPermission(user, 'system.manage') ||
      this.hasAnyPermission(user, ['system.update', 'system.configure']) ||
      this.isSuperAdmin(user)
    );
  }

  /**
   * Determines if user can access admin panel
   * @returns Whether user can access admin panel
   */
  canAccessAdmin(user: User): boolean {
    return this.hasAnyRole(user, ['admin', 'super_admin', 'moderator']);
  }

  /**
   * Determines if user can access analytics
   * @returns Whether user can access analytics
   */
  canAccessAnalytics(user: User): boolean {
    return (
      this.hasPermission(user, 'analytics.view') ||
      this.hasAnyRole(user, ['admin', 'super_admin', 'analyst'])
    );
  }

  /**
   * Determines if user can perform CRUD operations on resources
   * @returns Whether user can perform CRUD operations
   */
  canPerformCRUD(user: User, resourceType: string): string[] {
    const permissions: string[] = [];

    if (this.isAdmin(user)) {
      // Admin can do everything
      permissions.push(
        `${resourceType}.create`,
        `${resourceType}.read`,
        `${resourceType}.update`,
        `${resourceType}.delete`,
      );
    } else {
      // Check specific permissions
      if (this.hasPermission(user, `${resourceType}.create`)) {
        permissions.push(`${resourceType}.create`);
      }
      if (this.hasPermission(user, `${resourceType}.read`)) {
        permissions.push(`${resourceType}.read`);
      }
      if (this.hasPermission(user, `${resourceType}.update`)) {
        permissions.push(`${resourceType}.update`);
      }
      if (this.hasPermission(user, `${resourceType}.delete`)) {
        permissions.push(`${resourceType}.delete`);
      }
    }

    return permissions;
  }

  /**
   * Gets all user permissions
   * @returns Array of all user permissions
   */
  getAllPermissions(user: User): string[] {
    const permissions = new Set<string>();

    user.roles?.forEach((role) => {
      if (role.isActive && role.permissions) {
        role.permissions.forEach((permission) => {
          permissions.add(permission);
        });
      }
    });

    return Array.from(permissions);
  }

  /**
   * Gets user's highest priority role
   * @returns Highest priority role
   */
  getHighestPriorityRole(user: User): Role | null {
    if (!user.roles || user.roles.length === 0) {
      return null;
    }

    const activeRoles = user.roles.filter((role) => role.isActive);
    if (activeRoles.length === 0) {
      return null;
    }

    // Define role priority (higher number = higher priority)
    const rolePriority: Record<string, number> = {
      super_admin: 100,
      admin: 80,
      moderator: 60,
      manager: 50,
      analyst: 40,
      user: 20,
      guest: 10,
    };

    let highestRole = activeRoles[0];
    let highestPriority = rolePriority[highestRole.name] || 0;

    activeRoles.forEach((role) => {
      const priority = rolePriority[role.name] || 0;
      if (priority > highestPriority) {
        highestRole = role;
        highestPriority = priority;
      }
    });

    return highestRole;
  }

  /**
   * Gets user role hierarchy
   * @returns Array of roles in priority order
   */
  getRoleHierarchy(user: User): Role[] {
    if (!user.roles || user.roles.length === 0) {
      return [];
    }

    const activeRoles = user.roles.filter((role) => role.isActive);

    // Define role priority (higher number = higher priority)
    const rolePriority: Record<string, number> = {
      super_admin: 100,
      admin: 80,
      moderator: 60,
      manager: 50,
      analyst: 40,
      user: 20,
      guest: 10,
    };

    return activeRoles.sort((a, b) => {
      const priorityA = rolePriority[a.name] || 0;
      const priorityB = rolePriority[b.name] || 0;
      return priorityB - priorityA; // Sort in descending order
    });
  }

  /**
   * Validates role assignment
   * @returns Validation result
   */
  validateRoleAssignment(user: User, newRoles: Role[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for duplicate roles
    const roleIds = newRoles.map((role) => role.id);
    const uniqueRoleIds = [...new Set(roleIds)];
    if (roleIds.length !== uniqueRoleIds.length) {
      errors.push('Duplicate roles are not allowed');
    }

    // Check for inactive roles
    const inactiveRoles = newRoles.filter((role) => !role.isActive);
    if (inactiveRoles.length > 0) {
      errors.push('Cannot assign inactive roles');
    }

    // Check role compatibility (some roles can't be combined)
    const incompatibleRoles = this.getIncompatibleRoles(newRoles);
    if (incompatibleRoles.length > 0) {
      errors.push(`Incompatible role combinations: ${incompatibleRoles.join(', ')}`);
    }

    // Check if user has sufficient authority for these roles
    const currentHighestRole = this.getHighestPriorityRole(user);
    const requestedHighestRole = this.getHighestPriorityRoleFromList(newRoles);

    if (currentHighestRole && requestedHighestRole) {
      const currentPriority = this.getRolePriority(currentHighestRole.name);
      const requestedPriority = this.getRolePriority(requestedHighestRole.name);

      if (requestedPriority > currentPriority && !this.isAdmin(user)) {
        errors.push('Insufficient authority to assign higher priority roles');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gets compatible roles for user
   * @returns Array of compatible roles
   */
  getCompatibleRoles(user: User, allRoles: Role[]): Role[] {
    if (this.isSuperAdmin(user)) {
      return allRoles; // Super admin can have any role
    }

    const userPriority = this.getRolePriority(this.getHighestPriorityRole(user)?.name || '');

    return allRoles.filter((role) => {
      if (!role.isActive) {
        return false;
      }

      const rolePriority = this.getRolePriority(role.name);
      return rolePriority <= userPriority;
    });
  }

  /**
   * Private helper methods
   */

  private getIncompatibleRoles(roles: Role[]): string[] {
    const roleNames = roles.map((role) => role.name);
    const incompatible: string[] = [];

    // Example incompatibility rules
    if (roleNames.includes('guest') && roleNames.includes('admin')) {
      incompatible.push('guest + admin');
    }
    if (roleNames.includes('user') && roleNames.includes('super_admin')) {
      incompatible.push('user + super_admin');
    }

    return incompatible;
  }

  private getRolePriority(roleName: string): number {
    const rolePriority: Record<string, number> = {
      super_admin: 100,
      admin: 80,
      moderator: 60,
      manager: 50,
      analyst: 40,
      user: 20,
      guest: 10,
    };

    return rolePriority[roleName] || 0;
  }

  private getHighestPriorityRoleFromList(roles: Role[]): Role | null {
    if (roles.length === 0) {
      return null;
    }

    return roles.reduce((highest, current) => {
      const highestPriority = this.getRolePriority(highest.name);
      const currentPriority = this.getRolePriority(current.name);
      return currentPriority > highestPriority ? current : highest;
    }, roles[0]);
  }
}
