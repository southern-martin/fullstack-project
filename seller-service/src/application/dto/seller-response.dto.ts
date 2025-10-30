import { Exclude, Expose } from 'class-transformer';
import {
  SellerStatus,
  VerificationStatus,
  BusinessType,
} from '../../infrastructure/database/typeorm/entities/seller.entity';

export class SellerResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  businessName: string;

  @Expose()
  businessType: BusinessType;

  @Expose()
  businessEmail: string;

  @Expose()
  businessPhone: string;

  @Expose()
  taxId: string;

  @Expose()
  businessAddress: string;

  @Expose()
  businessCity: string;

  @Expose()
  businessState: string;

  @Expose()
  businessCountry: string;

  @Expose()
  businessPostalCode: string;

  @Expose()
  logoUrl: string;

  @Expose()
  description: string;

  @Expose()
  website: string;

  @Expose()
  status: SellerStatus;

  @Expose()
  verificationStatus: VerificationStatus;

  @Expose()
  verifiedAt: Date;

  @Expose()
  verifiedBy: number;

  @Expose()
  rejectionReason: string;

  @Expose()
  suspensionReason: string;

  @Expose()
  rating: number;

  @Expose()
  totalReviews: number;

  @Expose()
  totalProducts: number;

  @Expose()
  totalSales: number;

  @Expose()
  totalRevenue: number;

  @Expose()
  commissionRate: number;

  // Exclude sensitive banking information from normal responses
  @Exclude()
  bankAccountNumber: string;

  @Exclude()
  bankRoutingNumber: string;

  // Only show bank name and payment method
  @Expose()
  bankName: string;

  @Expose()
  paymentMethod: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  lastLoginAt: Date;
}

export class SellerBankingInfoDto {
  @Expose()
  id: number;

  @Expose()
  bankName: string;

  @Expose()
  bankAccountHolder: string;

  @Expose()
  bankAccountNumber: string;

  @Expose()
  bankRoutingNumber: string;

  @Expose()
  paymentMethod: string;
}

export class SellerListResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  businessName: string;

  @Expose()
  businessType: BusinessType;

  @Expose()
  businessEmail: string;

  @Expose()
  status: SellerStatus;

  @Expose()
  verificationStatus: VerificationStatus;

  @Expose()
  rating: number;

  @Expose()
  totalReviews: number;

  @Expose()
  totalProducts: number;

  @Expose()
  totalSales: number;

  @Expose()
  totalRevenue: number;

  @Expose()
  createdAt: Date;
}
