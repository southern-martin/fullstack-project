// Enterprise-grade interfaces for clean architecture

import { ReactNode } from 'react';
import { 
  User, 
  Product, 
  Order, 
  Customer, 
  ApiResponse, 
  PaginationMeta,
  FormField,
  NavigationItem,
  DomainEvent,
  AuditLog,
  Notification
} from '../types';

// Service layer interfaces
export interface IBaseService<T> {
  getAll(params?: QueryParams): Promise<ApiResponse<T[]>>;
  getById(id: string | number): Promise<ApiResponse<T>>;
  create(data: Partial<T>): Promise<ApiResponse<T>>;
  update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>>;
  delete(id: string | number): Promise<ApiResponse<void>>;
  search(query: string, params?: QueryParams): Promise<ApiResponse<T[]>>;
}

export interface IUserService extends IBaseService<User> {
  getByEmail(email: string): Promise<ApiResponse<User>>;
  updatePassword(id: string | number, password: string): Promise<ApiResponse<void>>;
  updatePermissions(id: string | number, permissions: string[]): Promise<ApiResponse<void>>;
  getAuditLogs(id: string | number): Promise<ApiResponse<AuditLog[]>>;
}

export interface IProductService extends IBaseService<Product> {
  getByCategory(categoryId: string): Promise<ApiResponse<Product[]>>;
  getByStatus(status: string): Promise<ApiResponse<Product[]>>;
  updateStock(id: string | number, quantity: number): Promise<ApiResponse<Product>>;
  getLowStock(threshold?: number): Promise<ApiResponse<Product[]>>;
  bulkUpdate(products: Partial<Product>[]): Promise<ApiResponse<Product[]>>;
}

export interface IOrderService extends IBaseService<Order> {
  getByCustomer(customerId: string): Promise<ApiResponse<Order[]>>;
  getByStatus(status: string): Promise<ApiResponse<Order[]>>;
  updateStatus(id: string | number, status: string): Promise<ApiResponse<Order>>;
  getRevenueStats(period: string): Promise<ApiResponse<any>>;
  exportOrders(filters: OrderFilters): Promise<Blob>;
}

export interface ICustomerService extends IBaseService<Customer> {
  getByEmail(email: string): Promise<ApiResponse<Customer>>;
  getLoyaltyStats(customerId: string): Promise<ApiResponse<any>>;
  updatePreferences(customerId: string, preferences: any): Promise<ApiResponse<Customer>>;
  getOrderHistory(customerId: string): Promise<ApiResponse<Order[]>>;
}

// Repository interfaces for data access
export interface IRepository<T> {
  findById(id: string | number): Promise<T | null>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  create(entity: Partial<T>): Promise<T>;
  update(id: string | number, entity: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
  count(filters?: Record<string, any>): Promise<number>;
}

// Query parameter interfaces
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
  search?: string;
  include?: string[];
}

export interface OrderFilters {
  status?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Component interfaces
export interface IBaseComponent {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

export interface ITableColumn<T = any> {
  key: string;
  title: string;
  dataIndex: string;
  render?: (value: any, record: T, index: number) => ReactNode;
  sorter?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface ITableProps<T = any> extends IBaseComponent {
  data: T[];
  columns: ITableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  rowKey?: string | ((record: T) => string);
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
}

export interface IFormProps extends IBaseComponent {
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  validationSchema?: any;
  layout?: 'vertical' | 'horizontal' | 'inline';
}

export interface IModalProps extends IBaseComponent {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode;
}

// Hook interfaces
export interface IUseApiOptions<T = any> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retry?: number;
  retryDelay?: number;
}

export interface IUseApiResult<T = any> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (data: T) => void;
}

export interface IUsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  total?: number;
}

export interface IUsePaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setLimit: (limit: number) => void;
}

// Context interfaces
export interface IAuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export interface IThemeContext {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: Record<string, string>;
  typography: Record<string, any>;
}

export interface INotificationContext {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

// Event handling interfaces
export interface IEventBus {
  emit(event: string, data?: any): void;
  on(event: string, callback: (data?: any) => void): () => void;
  off(event: string, callback: (data?: any) => void): void;
  once(event: string, callback: (data?: any) => void): void;
}

export interface IEventHandler<T = any> {
  handle(event: DomainEvent): Promise<void>;
  canHandle(event: DomainEvent): boolean;
}

// Validation interfaces
export interface IValidator<T = any> {
  validate(data: T): ValidationResult;
  validateField(field: string, value: any): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Cache interfaces
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

// Logger interfaces
export interface ILogger {
  debug(message: string, meta?: Record<string, any>): void;
  info(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  error(message: string, error?: Error, meta?: Record<string, any>): void;
}

// Configuration interfaces
export interface IConfigService {
  get<T>(key: string, defaultValue?: T): T;
  set<T>(key: string, value: T): void;
  has(key: string): boolean;
  remove(key: string): void;
  getAll(): Record<string, any>;
}

// Security interfaces
export interface ISecurityService {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  generateToken(payload: any): string;
  verifyToken(token: string): any;
  generateRefreshToken(): string;
  sanitizeInput(input: string): string;
  validateCSRF(token: string): boolean;
}

// File handling interfaces
export interface IFileService {
  upload(file: File, options?: UploadOptions): Promise<UploadResult>;
  download(url: string): Promise<Blob>;
  delete(url: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

export interface UploadOptions {
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
  generateThumbnail?: boolean;
  compress?: boolean;
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  type: string;
  thumbnailUrl?: string;
}

// Analytics interfaces
export interface IAnalyticsService {
  track(event: string, properties?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(name: string, properties?: Record<string, any>): void;
  group(groupId: string, traits?: Record<string, any>): void;
}

// Export interfaces
export interface IExportService {
  exportToCSV<T>(data: T[], filename: string): void;
  exportToExcel<T>(data: T[], filename: string): void;
  exportToPDF<T>(data: T[], filename: string, template?: string): void;
  generateReport(type: string, filters: Record<string, any>): Promise<Blob>;
}
