// Core application types for enterprise-grade type safety

// Base entity interface
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

// User related types
export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  lastLoginAt?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest'
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

// Product related types
export interface Product extends BaseEntity {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  cost?: number;
  sku: string;
  stock: number;
  minStock: number;
  maxStock?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  status: ProductStatus;
  weight?: number;
  dimensions?: ProductDimensions;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductCategory extends BaseEntity {
  name: string;
  description?: string;
  parentId?: string;
  children?: ProductCategory[];
  image?: string;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in' | 'm';
}

// Order related types
export interface Order extends BaseEntity {
  orderNumber: string;
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Customer extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  addresses: Address[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  preferences: CustomerPreferences;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
}

export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface CustomerPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  language: string;
  currency: string;
  timezone: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export enum ShippingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned'
}

// Dashboard and Analytics types
export interface DashboardStats {
  customers: StatItem;
  orders: StatItem;
  products: StatItem;
  revenue: StatItem;
}

export interface StatItem {
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
  trend?: number[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
  meta?: ResponseMeta;
}

export interface ApiError {
  field?: string;
  message: string;
  code: string;
}

export interface ResponseMeta {
  pagination?: PaginationMeta;
  filters?: Record<string, any>;
  sort?: SortMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SortMeta {
  field: string;
  direction: 'asc' | 'desc';
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
  required: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationRule[];
  defaultValue?: any;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  path?: string;
  icon?: React.ComponentType<any>;
  children?: NavigationItem[];
  permissions?: string[];
  badge?: string | number;
  isActive?: boolean;
}

// Theme and UI types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// Configuration types
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: {
    darkMode: boolean;
    notifications: boolean;
    analytics: boolean;
    multiLanguage: boolean;
  };
  limits: {
    maxFileSize: number;
    maxUploadFiles: number;
    sessionTimeout: number;
  };
}

// Event types for enterprise event handling
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  data: Record<string, any>;
  metadata: Record<string, any>;
  occurredAt: string;
}

// Audit types
export interface AuditLog extends BaseEntity {
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// Notification types
export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  priority: NotificationPriority;
  expiresAt?: string;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SYSTEM = 'system'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}
