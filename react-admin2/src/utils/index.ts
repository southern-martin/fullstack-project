// Enterprise-grade utility functions for clean, reusable code

import { VALIDATION, CURRENCY, DATE_FORMATS } from '../constants';

// Type guards for runtime type checking
export const isString = (value: any): value is string => typeof value === 'string';
export const isNumber = (value: any): value is number => typeof value === 'number' && !isNaN(value);
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean';
export const isArray = (value: any): value is any[] => Array.isArray(value);
export const isObject = (value: any): value is object => value !== null && typeof value === 'object' && !Array.isArray(value);
export const isFunction = (value: any): value is Function => typeof value === 'function';
export const isNull = (value: any): value is null => value === null;
export const isUndefined = (value: any): value is undefined => value === undefined;
export const isNullOrUndefined = (value: any): value is null | undefined => value === null || value === undefined;

// String utilities
export const stringUtils = {
  // Capitalize first letter
  capitalize: (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Convert to title case
  toTitleCase: (str: string): string => {
    if (!str) return str;
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Convert to kebab case
  toKebabCase: (str: string): string => {
    if (!str) return str;
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },

  // Convert to camel case
  toCamelCase: (str: string): string => {
    if (!str) return str;
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  },

  // Convert to snake case
  toSnakeCase: (str: string): string => {
    if (!str) return str;
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },

  // Truncate string with ellipsis
  truncate: (str: string, length: number, suffix: string = '...'): string => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  },

  // Remove HTML tags
  stripHtml: (str: string): string => {
    if (!str) return str;
    return str.replace(/<[^>]*>/g, '');
  },

  // Generate random string
  random: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Generate slug from string
  slugify: (str: string): string => {
    if (!str) return str;
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};

// Number utilities
export const numberUtils = {
  // Format number with commas
  format: (num: number, decimals: number = 0): string => {
    if (!isNumber(num)) return '0';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  // Format currency
  formatCurrency: (amount: number, currency: string = CURRENCY.DEFAULT): string => {
    if (!isNumber(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Format percentage
  formatPercentage: (value: number, decimals: number = 1): string => {
    if (!isNumber(value)) return '0%';
    return `${value.toFixed(decimals)}%`;
  },

  // Clamp number between min and max
  clamp: (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
  },

  // Round to specified decimal places
  round: (num: number, decimals: number = 2): number => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  // Generate random number between min and max
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Check if number is in range
  inRange: (num: number, min: number, max: number): boolean => {
    return num >= min && num <= max;
  },
};

// Date utilities
export const dateUtils = {
  // Format date
  format: (date: Date | string, format: string = DATE_FORMATS.DISPLAY): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';

    const options: Intl.DateTimeFormatOptions = {};
    
    switch (format) {
      case DATE_FORMATS.DISPLAY:
        options.year = 'numeric';
        options.month = 'short';
        options.day = '2-digit';
        break;
      case DATE_FORMATS.DISPLAY_WITH_TIME:
        options.year = 'numeric';
        options.month = 'short';
        options.day = '2-digit';
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      case DATE_FORMATS.API:
        return d.toISOString().split('T')[0];
      case DATE_FORMATS.TIME_ONLY:
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      default:
        return d.toLocaleDateString();
    }

    return d.toLocaleDateString('en-US', options);
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date: Date | string): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  },

  // Check if date is today
  isToday: (date: Date | string): boolean => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  // Check if date is yesterday
  isYesterday: (date: Date | string): boolean => {
    const d = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.toDateString() === yesterday.toDateString();
  },

  // Add days to date
  addDays: (date: Date | string, days: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  // Get start of day
  startOfDay: (date: Date | string): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  // Get end of day
  endOfDay: (date: Date | string): Date => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  },
};

// Validation utilities
export const validationUtils = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    return VALIDATION.EMAIL_REGEX.test(email);
  },

  // Phone validation
  isValidPhone: (phone: string): boolean => {
    return VALIDATION.PHONE_REGEX.test(phone);
  },

  // URL validation
  isValidUrl: (url: string): boolean => {
    return VALIDATION.URL_REGEX.test(url);
  },

  // Password strength validation
  isStrongPassword: (password: string): boolean => {
    return VALIDATION.PASSWORD_REGEX.test(password) && password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
  },

  // SKU validation
  isValidSku: (sku: string): boolean => {
    return VALIDATION.SKU_REGEX.test(sku);
  },

  // Required field validation
  isRequired: (value: any): boolean => {
    if (isString(value)) return value.trim().length > 0;
    if (isArray(value)) return value.length > 0;
    if (isObject(value)) return Object.keys(value).length > 0;
    return !isNullOrUndefined(value);
  },

  // Min length validation
  hasMinLength: (value: string, minLength: number): boolean => {
    return isString(value) && value.length >= minLength;
  },

  // Max length validation
  hasMaxLength: (value: string, maxLength: number): boolean => {
    return isString(value) && value.length <= maxLength;
  },
};

// Object utilities
export const objectUtils = {
  // Deep clone object
  clone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array) return obj.map(item => objectUtils.clone(item)) as any;
    if (typeof obj === 'object') {
      const clonedObj: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = objectUtils.clone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  },

  // Deep merge objects
  merge: <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          objectUtils.merge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return objectUtils.merge(target, ...sources);
  },

  // Pick specific properties from object
  pick: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  // Omit specific properties from object
  omit: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  // Check if object is empty
  isEmpty: (obj: any): boolean => {
    if (isNull(obj) || isUndefined(obj)) return true;
    if (isArray(obj)) return obj.length === 0;
    if (isObject(obj)) return Object.keys(obj).length === 0;
    return false;
  },

  // Get nested property value safely
  get: (obj: any, path: string, defaultValue?: any): any => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return defaultValue;
      }
    }
    
    return result;
  },

  // Set nested property value
  set: (obj: any, path: string, value: any): void => {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  },
};

// Array utilities
export const arrayUtils = {
  // Remove duplicates from array
  unique: <T>(arr: T[]): T[] => {
    return [...new Set(arr)];
  },

  // Group array by key
  groupBy: <T>(arr: T[], key: keyof T): Record<string, T[]> => {
    return arr.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  // Sort array by key
  sortBy: <T>(arr: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Chunk array into smaller arrays
  chunk: <T>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  // Flatten nested arrays
  flatten: <T>(arr: T[]): T[] => {
    return arr.reduce((flat, item) => {
      return flat.concat(Array.isArray(item) ? arrayUtils.flatten(item) : item);
    }, [] as T[]);
  },

  // Get random item from array
  random: <T>(arr: T[]): T | undefined => {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Shuffle array
  shuffle: <T>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
};

// Performance utilities
export const performanceUtils = {
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Memoize function
  memoize: <T extends (...args: any[]) => any>(func: T): T => {
    const cache = new Map();
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  },
};

// Error handling utilities
export const errorUtils = {
  // Create standardized error
  createError: (message: string, code?: string, details?: any): Error => {
    const error = new Error(message);
    (error as any).code = code;
    (error as any).details = details;
    return error;
  },

  // Check if error is network error
  isNetworkError: (error: any): boolean => {
    return error?.name === 'NetworkError' || 
           error?.message?.includes('network') ||
           error?.message?.includes('fetch');
  },

  // Get user-friendly error message
  getUserFriendlyMessage: (error: any): string => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
};

// Export all utilities
export default {
  // Type guards
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isNull,
  isUndefined,
  isNullOrUndefined,
  
  // Utility modules
  stringUtils,
  numberUtils,
  dateUtils,
  validationUtils,
  objectUtils,
  arrayUtils,
  performanceUtils,
  errorUtils,
};
