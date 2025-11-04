import { User, Role } from '../../../shared/types';
import { USER_CONSTANTS } from '../constants/userConstants';

/**
 * User utility functions for common operations
 */

/**
 * Get user's full name
 */
export const getUserFullName = (user: User): string => {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return fullName || 'N/A';
};

/**
 * Get user's initials for avatar
 */
export const getUserInitials = (user: User): string => {
  const firstName = user.firstName?.[0];
  const lastName = user.lastName?.[0];

  if (firstName && lastName) {
    return `${firstName}${lastName}`.toUpperCase();
  }

  return firstName || lastName || '?';
};

/**
 * Get user's role names as string
 */
export const getUserRoleNames = (user: User): string[] => {
  return user.roles?.map((role: Role) => role.name) || [];
};

/**
 * Check if user has specific role
 */
export const userHasRole = (user: User, roleName: string): boolean => {
  return user.roles?.some((role: Role) => role.name === roleName) || false;
};

/**
 * Check if user is admin
 */
export const isUserAdmin = (user: User): boolean => {
  return userHasRole(user, 'admin');
};

/**
 * Format user creation date
 */
export const formatUserDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Get user status text with styling
 */
export const getUserStatusInfo = (user: User) => {
  const isActive = user.isActive;
  return {
    text: isActive ? 'Active' : 'Inactive',
    className: isActive
      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
    icon: isActive ? 'CheckIcon' : 'XMarkIcon'
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return USER_CONSTANTS.VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validate user name
 */
export const isValidUserName = (name: string): boolean => {
  return name.length >= USER_CONSTANTS.VALIDATION.MIN_NAME_LENGTH &&
         name.length <= USER_CONSTANTS.VALIDATION.MAX_NAME_LENGTH;
};

/**
 * Validate password strength
 */
export const isPasswordValid = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < USER_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${USER_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH} characters`);
  }

  if (password.length > USER_CONSTANTS.VALIDATION.MAX_PASSWORD_LENGTH) {
    errors.push(`Password must not exceed ${USER_CONSTANTS.VALIDATION.MAX_PASSWORD_LENGTH} characters`);
  }

  // Add more password validation rules as needed
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Filter users by search term
 */
export const filterUsers = (users: User[], searchTerm: string): User[] => {
  if (!searchTerm || searchTerm.trim() === '') {
    return users;
  }

  const lowerSearchTerm = searchTerm.toLowerCase().trim();

  return users.filter(user => {
    const fullName = getUserFullName(user).toLowerCase();
    const email = user.email.toLowerCase();
    const roles = getUserRoleNames(user).join(' ').toLowerCase();

    return fullName.includes(lowerSearchTerm) ||
           email.includes(lowerSearchTerm) ||
           roles.includes(lowerSearchTerm);
  });
};

/**
 * Sort users by specified field
 */
export const sortUsers = (
  users: User[],
  sortBy: keyof User,
  sortOrder: 'asc' | 'desc'
): User[] => {
  return [...users].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle null/undefined values
    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    // Handle date comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      const comparison = aDate.getTime() - bDate.getTime();
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    // Handle number comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue;
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    // Handle boolean comparison
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      const comparison = aValue === bValue ? 0 : (aValue ? 1 : -1);
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    return 0;
  });
};

/**
 * Get user display name with fallback
 */
export const getUserDisplayName = (user: User): string => {
  const fullName = getUserFullName(user);
  if (fullName !== 'N/A') return fullName;

  return user.email.split('@')[0] || 'Unknown User';
};

/**
 * Get user's primary role (first role or highest priority)
 */
export const getPrimaryRole = (user: User): Role | null => {
  if (!user.roles || user.roles.length === 0) return null;

  // Define role priority (admin > manager > user > guest)
  const rolePriority = ['admin', 'manager', 'user', 'guest'];

  return user.roles.reduce((highest: Role, current: Role) => {
    const highestPriority = rolePriority.indexOf(highest.name);
    const currentPriority = rolePriority.indexOf(current.name);

    return currentPriority < highestPriority ? current : highest;
  }, user.roles[0]);
};

/**
 * Check if user account is recently created
 */
export const isRecentlyCreated = (user: User, days: number = 7): boolean => {
  try {
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const diffInDays = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= days;
  } catch {
    return false;
  }
};

/**
 * Get user age from date of birth (if available)
 */
export const getUserAge = (dateOfBirth?: string): number | null => {
  if (!dateOfBirth) return null;

  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  } catch {
    return null;
  }
};

/**
 * Export user data to CSV format
 */
export const exportUsersToCSV = (users: User[]): string => {
  const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Roles', 'Status', 'Created Date'];
  const csvContent = [
    headers.join(','),
    ...users.map(user => [
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      getUserRoleNames(user).join('; '),
      user.isActive ? 'Active' : 'Inactive',
      formatUserDate(user.createdAt)
    ].join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Generate user statistics
 */
export const generateUserStats = (users: User[]) => {
  const total = users.length;
  const active = users.filter(user => user.isActive).length;
  const inactive = total - active;
  const admins = users.filter(user => isUserAdmin(user)).length;
  const recentlyCreated = users.filter(user => isRecentlyCreated(user)).length;

  const roleStats = users.reduce((acc, user) => {
    user.roles?.forEach((role: Role) => {
      acc[role.name] = (acc[role.name] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    active,
    inactive,
    admins,
    recentlyCreated,
    roleStats,
    activePercentage: total > 0 ? (active / total) * 100 : 0,
    adminPercentage: total > 0 ? (admins / total) * 100 : 0
  };
};
