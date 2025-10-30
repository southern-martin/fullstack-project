import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

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

@Entity('sellers')
@Index('idx_user_id', ['userId'])
@Index('idx_status', ['status'])
@Index('idx_verification_status', ['verificationStatus'])
@Index('idx_rating', ['rating'])
@Index('idx_created_at', ['createdAt'])
export class SellerTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // User Reference
  @Column({ name: 'user_id', type: 'int', nullable: false })
  @Index('idx_user_id_unique', { unique: true })
  userId: number;

  // Business Information
  @Column({ name: 'business_name', type: 'varchar', length: 255, nullable: false })
  @Index('idx_business_name')
  businessName: string;

  @Column({
    name: 'business_type',
    type: 'enum',
    enum: BusinessType,
    default: BusinessType.INDIVIDUAL,
  })
  businessType: BusinessType;

  @Column({ name: 'business_email', type: 'varchar', length: 255, nullable: true })
  businessEmail: string;

  @Column({ name: 'business_phone', type: 'varchar', length: 50, nullable: true })
  businessPhone: string;

  @Column({ name: 'tax_id', type: 'varchar', length: 100, nullable: true })
  taxId: string;

  @Column({ name: 'business_address', type: 'text', nullable: true })
  businessAddress: string;

  @Column({ name: 'business_city', type: 'varchar', length: 100, nullable: true })
  businessCity: string;

  @Column({ name: 'business_state', type: 'varchar', length: 100, nullable: true })
  businessState: string;

  @Column({ name: 'business_country', type: 'varchar', length: 100, nullable: true })
  businessCountry: string;

  @Column({ name: 'business_postal_code', type: 'varchar', length: 20, nullable: true })
  businessPostalCode: string;

  // Seller Profile
  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'website', type: 'varchar', length: 255, nullable: true })
  website: string;

  // Status & Verification
  @Column({ name: 'status', type: 'enum', enum: SellerStatus, default: SellerStatus.PENDING })
  status: SellerStatus;

  @Column({
    name: 'verification_status',
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.UNVERIFIED,
  })
  verificationStatus: VerificationStatus;

  @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ name: 'verified_by', type: 'int', nullable: true })
  verifiedBy: number; // Admin user ID

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'suspension_reason', type: 'text', nullable: true })
  suspensionReason: string;

  // Ratings & Reviews
  @Column({ name: 'rating', type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  rating: number;

  @Column({ name: 'total_reviews', type: 'int', default: 0 })
  totalReviews: number;

  // Sales Metrics
  @Column({ name: 'total_products', type: 'int', default: 0 })
  totalProducts: number;

  @Column({ name: 'total_sales', type: 'int', default: 0 })
  totalSales: number;

  @Column({ name: 'total_revenue', type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  totalRevenue: number;

  // Commission Settings
  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  commissionRate: number; // If null, uses platform default

  // Banking Information
  @Column({ name: 'bank_name', type: 'varchar', length: 255, nullable: true })
  bankName: string;

  @Column({ name: 'bank_account_holder', type: 'varchar', length: 255, nullable: true })
  bankAccountHolder: string;

  @Column({ name: 'bank_account_number', type: 'varchar', length: 255, nullable: true })
  bankAccountNumber: string;

  @Column({ name: 'bank_routing_number', type: 'varchar', length: 50, nullable: true })
  bankRoutingNumber: string;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 50,
    nullable: true,
    default: 'bank_transfer',
  })
  paymentMethod: string; // bank_transfer, paypal, stripe, etc.

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;
}
