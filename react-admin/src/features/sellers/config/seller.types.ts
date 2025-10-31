/**
 * Seller Module Types
 * 
 * Defines TypeScript interfaces for seller entities and related data structures.
 * Aligned with seller-service backend entity definitions.
 */

export enum SellerStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum BusinessType {
  INDIVIDUAL = 'individual',
  SOLE_PROPRIETOR = 'sole_proprietor',
  LLC = 'llc',
  CORPORATION = 'corporation',
  PARTNERSHIP = 'partnership',
}

export interface Seller {
  id: number;
  userId: number;
  
  // Business Information
  businessName: string;
  businessType: BusinessType;
  businessEmail?: string;
  businessPhone?: string;
  taxId?: string;
  businessAddress?: string;
  businessCity?: string;
  businessState?: string;
  businessCountry?: string;
  businessPostalCode?: string;
  
  // Seller Profile
  logoUrl?: string;
  description?: string;
  website?: string;
  
  // Status & Verification
  status: SellerStatus;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verifiedAt?: string;
  verifiedBy?: number;
  rejectedAt?: string;
  rejectionReason?: string;
  
  // Banking Information
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankAccountName?: string;
  paymentTerms?: string;
  
  // Performance Metrics
  rating: number;
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  successfulOrders: number;
  cancelledOrders: number;
  
  // Compliance
  documentsUploaded: boolean;
  backgroundCheckCompleted: boolean;
  agreementSigned: boolean;
  agreementSignedAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Extended (from API joins)
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface CreateSellerRequest {
  userId: number;
  businessName: string;
  businessType: BusinessType;
  businessEmail?: string;
  businessPhone?: string;
  taxId?: string;
  businessAddress?: string;
  businessCity?: string;
  businessState?: string;
  businessCountry?: string;
  businessPostalCode?: string;
  description?: string;
  website?: string;
}

export interface UpdateSellerProfileRequest {
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessCity?: string;
  businessState?: string;
  businessCountry?: string;
  businessPostalCode?: string;
  logoUrl?: string;
  description?: string;
  website?: string;
}

export interface UpdateSellerBankingRequest {
  bankAccountNumber: string;
  bankRoutingNumber: string;
  bankAccountName: string;
  paymentTerms?: string;
}

export interface SellerAnalyticsOverview {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProducts: number;
  activeProducts: number;
  conversionRate: number;
  rating: number;
  reviewCount: number;
}

export interface SellerSalesTrend {
  date: string;
  sales: number;
  revenue: number;
}

export interface SellerProductAnalytics {
  productId: number;
  productName: string;
  totalSold: number;
  revenue: number;
  views: number;
}

export interface SellerRevenueAnalytics {
  period: string;
  gross: number;
  fees: number;
  net: number;
}
