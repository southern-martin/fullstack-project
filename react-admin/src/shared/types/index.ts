// Common types used across the application
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    company?: string;
    industry?: string;
    preferredContact?: string;
    newsletter?: boolean;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Carrier {
  id: number;
  name: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: {
    code?: string;
    [key: string]: any;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarrierData {
  name: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: {
    code?: string;
    [key: string]: any;
  };
}

export interface UpdateCarrierData {
  name?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: {
    code?: string;
    [key: string]: any;
  };
  isActive?: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles?: number[];
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: number[];
  isActive?: boolean;
}

export interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    company?: string;
    industry?: string;
    preferredContact?: string;
    newsletter?: boolean;
  };
}

export interface UpdateCustomerData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    company?: string;
    industry?: string;
    preferredContact?: string;
    newsletter?: boolean;
  };
  isActive?: boolean;
}

export interface PricingRule {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  currency: string;
  rules: {
    [key: string]: any;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePricingRuleData {
  name: string;
  description?: string;
  basePrice: number;
  currency: string;
  rules: {
    [key: string]: any;
  };
}

export interface UpdatePricingRuleData {
  name?: string;
  description?: string;
  basePrice?: number;
  currency?: string;
  rules?: {
    [key: string]: any;
  };
  isActive?: boolean;
}

export interface Translation {
  id: number;
  key: string;
  value: string;
  language: string;
  namespace?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTranslationData {
  key: string;
  value: string;
  language: string;
  namespace?: string;
}

export interface UpdateTranslationData {
  key?: string;
  value?: string;
  language?: string;
  namespace?: string;
}

export interface Language {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
