import { Injectable, BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { CreateSellerDto } from '../dto/create-seller.dto';
import { SellerTypeOrmEntity, SellerStatus, VerificationStatus } from '../../infrastructure/database/typeorm/entities/seller.entity';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { UserServiceClient } from '../../infrastructure/external/user-service.client';
import { SellerCacheService } from '../services/seller-cache.service';

/**
 * Register Seller Use Case
 * Handles new seller registration with validation and caching
 * 
 * Business Rules:
 * - User must exist and be active
 * - User can only have one seller account
 * - Initial status: PENDING
 * - Initial verification status: UNVERIFIED
 */
@Injectable()
export class RegisterSellerUseCase {
  constructor(
    private readonly sellerRepository: SellerRepository,
    private readonly userServiceClient: UserServiceClient,
    private readonly sellerCacheService: SellerCacheService,
    private readonly logger: WinstonLoggerService,
  ) {
    this.logger.setContext(RegisterSellerUseCase.name);
  }

  async execute(userId: number, createSellerDto: CreateSellerDto): Promise<SellerTypeOrmEntity> {
    // 1. Validate user exists and is active
    this.logger.debug(`Validating user ${userId} before seller registration`);
    const isValidUser = await this.userServiceClient.validateUser(userId);

    if (!isValidUser) {
      this.logger.warn(`Seller registration failed - User ${userId} not found or inactive`);
      throw new BadRequestException('User not found or inactive. Cannot create seller account.');
    }

    // 2. Check if user already has a seller account
    const existingSeller = await this.sellerRepository.findByUserId(userId);
    if (existingSeller) {
      this.logger.warn(`Seller registration failed - User ${userId} already has seller account`);
      throw new ConflictException('User already has a seller account');
    }

    // 3. Create seller with default status and metrics
    const sellerData = {
      ...createSellerDto,
      userId,
      status: SellerStatus.PENDING,
      verificationStatus: VerificationStatus.UNVERIFIED,
      rating: 0,
      totalReviews: 0,
      totalProducts: 0,
      totalSales: 0,
      totalRevenue: 0,
    };

    const seller = await this.sellerRepository.create(sellerData);

    // 4. Cache the newly created seller
    await this.sellerCacheService.cacheSeller(seller);

    // 5. Log business event
    this.logger.logEvent(
      'seller_registered',
      {
        sellerId: seller.id,
        userId: seller.userId,
        businessName: seller.businessName,
        status: seller.status,
        verificationStatus: seller.verificationStatus,
      },
      userId.toString(),
    );

    this.logger.log(`Seller registered successfully for user ${userId}`);
    return seller;
  }
}
