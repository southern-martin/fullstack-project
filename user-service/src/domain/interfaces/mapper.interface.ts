/**
 * Mapper Interface
 *
 * Generic interface for mapping between different data representations.
 * Follows Repository and Mapper patterns from Domain-Driven Design.
 *
 * Business Rules:
 * - Provides generic mapping contract
 * - Supports bidirectional mapping
 * - Type-safe transformations
 */

/**
 * Base mapper interface for bidirectional transformations
 */
export interface IMapper<TSource, TTarget> {
  /**
   * Maps from source to target
   * @param source - Source entity/object
   * @returns Target entity/object
   */
  toTarget(source: TSource): TTarget;

  /**
   * Maps from target to source
   * @param target - Target entity/object
   * @returns Source entity/object
   */
  toSource(target: TTarget): TSource;

  /**
   * Maps array of sources to array of targets
   * @param sources - Array of source entities/objects
   * @returns Array of target entities/objects
   */
  toTargets(sources: TSource[]): TTarget[];

  /**
   * Maps array of targets to array of sources
   * @param targets - Array of target entities/objects
   * @returns Array of source entities/objects
   */
  toSources(targets: TTarget[]): TSource[];
}

/**
 * User creation data interface
 */
export interface UserCreationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: UserAddressData;
  preferences?: Record<string, any>;
  roleIds?: number[];
}

/**
 * User update data interface
 */
export interface UserUpdateData {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: UserAddressData;
  preferences?: Record<string, any>;
  roleIds?: number[];
}

/**
 * User display data interface
 */
export interface UserDisplayData {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  initials: string;
  phone?: string;
  formattedPhone?: string;
  dateOfBirth?: string;
  age?: string;
  address?: string;
  formattedAddress?: string;
  avatar?: string;
  status: string;
  roles: string[];
  permissions: string[];
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profileCompletion?: number;
  timezone?: string;
}

/**
 * User address data interface
 */
export interface UserAddressData {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

/**
 * User search filters interface
 */
export interface UserSearchFilters {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  lastLoginAfter?: Date;
  lastLoginBefore?: Date;
  ageMin?: number;
  ageMax?: number;
  country?: string;
}

/**
 * User pagination options interface
 */
export interface UserPaginationOptions {
  page: number;
  limit: number;
  sortBy?: keyof UserDisplayData;
  sortOrder?: 'asc' | 'desc';
}

/**
 * User search result interface
 */
export interface UserSearchResult {
  users: UserDisplayData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * User statistics interface
 */
export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  recentlyCreated: number;
  recentlyActive: number;
  byRole: Record<string, number>;
  byCountry: Record<string, number>;
  averageAge?: number;
  registrationTrend: {
    date: string;
    count: number;
  }[];
}

/**
 * User bulk operation result interface
 */
export interface UserBulkOperationResult {
  successful: number;
  failed: number;
  errors: {
    index: number;
    error: string;
    data: any;
  }[];
  successfulIds: number[];
}

/**
 * User export options interface
 */
export interface UserExportOptions {
  format: 'csv' | 'excel' | 'json';
  fields?: (keyof UserDisplayData)[];
  filters?: UserSearchFilters;
  includeInactive?: boolean;
  includeSensitive?: boolean;
}

/**
 * User import result interface
 */
export interface UserImportResult {
  total: number;
  imported: number;
  failed: number;
  duplicates: number;
  errors: {
    row: number;
    field: string;
    error: string;
  }[];
  importedIds: number[];
}

/**
 * User activity data interface
 */
export interface UserActivityData {
  id: number;
  userId: number;
  action: string;
  resource?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * User session data interface
 */
export interface UserSessionData {
  id: string;
  userId: number;
  token?: string;
  refreshToken?: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  lastAccessedAt?: Date;
}

/**
 * User notification data interface
 */
export interface UserNotificationData {
  id: number;
  userId: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  isEmailSent: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
}

/**
 * User preference update data interface
 */
export interface UserPreferenceUpdateData {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  privacyLevel?: 'public' | 'friends' | 'private';
  dashboardLayout?: 'grid' | 'list' | 'cards';
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat?: '12h' | '24h';
  currency?: string;
  itemsPerPage?: number;
  autoSave?: boolean;
  twoFactorAuth?: boolean;
}

/**
 * User security data interface
 */
export interface UserSecurityData {
  userId: number;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  backupCodes?: string[];
  failedLoginAttempts: number;
  lockedUntil?: Date;
  passwordChangedAt?: Date;
  emailChangedAt?: Date;
  lastPasswordReset?: Date;
  securityQuestions?: {
    question: string;
    answerHash: string;
  }[];
  trustedDevices?: {
    deviceId: string;
    deviceName: string;
    addedAt: Date;
    lastUsedAt: Date;
  }[];
}
