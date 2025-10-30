import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import {
  SellerTypeOrmEntity,
  SellerStatus,
  VerificationStatus,
  BusinessType,
} from '../../infrastructure/database/typeorm/entities/seller.entity';
import { CreateSellerDto } from '../../application/dto/create-seller.dto';
import {
  UpdateSellerProfileDto,
  UpdateBankingInfoDto,
  UpdateSellerDto,
} from '../../application/dto/update-seller.dto';
import { UserServiceClient } from '../../infrastructure/external/user-service.client';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';

describe('SellerService', () => {
  let service: SellerService;
  let repository: jest.Mocked<SellerRepository>;
  let userServiceClient: jest.Mocked<UserServiceClient>;
  let cacheService: jest.Mocked<RedisCacheService>;
  let logger: jest.Mocked<WinstonLoggerService>;

  // Mock seller data
  const mockSeller: Partial<SellerTypeOrmEntity> = {
    id: 1,
    userId: 100,
    businessName: 'Test Business',
    businessType: BusinessType.LLC,
    businessEmail: 'test@business.com',
    businessPhone: '+1234567890',
    businessAddress: '123 Test St',
    businessCity: 'Test City',
    businessState: 'TS',
    businessCountry: 'US',
    status: SellerStatus.PENDING,
    verificationStatus: VerificationStatus.UNVERIFIED,
    rating: 0,
    totalReviews: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByStatus: jest.fn(),
      findPendingVerification: jest.fn(),
      count: jest.fn(),
    };

    const mockUserServiceClient = {
      validateUser: jest.fn(),
      getUserById: jest.fn(),
      getUsersByIds: jest.fn(),
      healthCheck: jest.fn(),
    };

    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      deleteByPattern: jest.fn(),
      exists: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn(),
    };

    const mockLogger = {
      setContext: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      logEvent: jest.fn(),
      logRequest: jest.fn(),
      logQuery: jest.fn(),
      logAuth: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellerService,
        {
          provide: SellerRepository,
          useValue: mockRepository,
        },
        {
          provide: UserServiceClient,
          useValue: mockUserServiceClient,
        },
        {
          provide: RedisCacheService,
          useValue: mockCacheService,
        },
        {
          provide: WinstonLoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<SellerService>(SellerService);
    repository = module.get(SellerRepository);
    userServiceClient = module.get(UserServiceClient);
    cacheService = module.get(RedisCacheService);
    logger = module.get(WinstonLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerSeller', () => {
    const createDto: CreateSellerDto = {
      userId: 100,
      businessName: 'Test Business',
      businessType: BusinessType.LLC,
      businessEmail: 'test@business.com',
      businessPhone: '+1234567890',
    };

    it('should create a new seller with pending status', async () => {
      userServiceClient.validateUser.mockResolvedValue(true);
      repository.findByUserId.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockSeller as SellerTypeOrmEntity);
      cacheService.set.mockResolvedValue(true);

      const result = await service.registerSeller(100, createDto);

      expect(userServiceClient.validateUser).toHaveBeenCalledWith(100);
      expect(repository.findByUserId).toHaveBeenCalledWith(100);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 100,
          businessName: 'Test Business',
          status: SellerStatus.PENDING,
          verificationStatus: VerificationStatus.UNVERIFIED,
          rating: 0,
          totalReviews: 0,
          totalProducts: 0,
          totalSales: 0,
          totalRevenue: 0,
        }),
      );
      expect(cacheService.set).toHaveBeenCalled();
      expect(result).toEqual(mockSeller);
    });

    it('should throw ConflictException if user already has seller account', async () => {
      userServiceClient.validateUser.mockResolvedValue(true);
      repository.findByUserId.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      await expect(service.registerSeller(100, createDto)).rejects.toThrow(ConflictException);
      await expect(service.registerSeller(100, createDto)).rejects.toThrow(
        'User already has a seller account',
      );
    });

    it('should throw BadRequestException if user not found or inactive', async () => {
      userServiceClient.validateUser.mockResolvedValue(false);

      await expect(service.registerSeller(100, createDto)).rejects.toThrow(BadRequestException);
      await expect(service.registerSeller(100, createDto)).rejects.toThrow(
        'User not found or inactive',
      );
    });
  });

  describe('getSellerById', () => {
    it('should return seller when found', async () => {
      cacheService.get.mockResolvedValue(null); // Cache miss
      repository.findById.mockResolvedValue(mockSeller as SellerTypeOrmEntity);
      cacheService.set.mockResolvedValue(true);

      const result = await service.getSellerById(1);

      expect(cacheService.get).toHaveBeenCalledWith('seller:id:1');
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(cacheService.set).toHaveBeenCalled();
      expect(result).toEqual(mockSeller);
    });

    it('should return cached seller when cache hit', async () => {
      cacheService.get.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      const result = await service.getSellerById(1);

      expect(cacheService.get).toHaveBeenCalledWith('seller:id:1');
      expect(repository.findById).not.toHaveBeenCalled();
      expect(result).toEqual(mockSeller);
    });

    it('should throw NotFoundException when seller not found', async () => {
      cacheService.get.mockResolvedValue(null);
      repository.findById.mockResolvedValue(null);

      await expect(service.getSellerById(999)).rejects.toThrow(NotFoundException);
      await expect(service.getSellerById(999)).rejects.toThrow('Seller with id 999 not found');
    });
  });

  describe('getSellerByUserId', () => {
    it('should return seller when found', async () => {
      cacheService.get.mockResolvedValue(null); // Cache miss
      repository.findByUserId.mockResolvedValue(mockSeller as SellerTypeOrmEntity);
      cacheService.set.mockResolvedValue(true);

      const result = await service.getSellerByUserId(100);

      expect(cacheService.get).toHaveBeenCalledWith('seller:userId:100');
      expect(repository.findByUserId).toHaveBeenCalledWith(100);
      expect(cacheService.set).toHaveBeenCalled();
      expect(result).toEqual(mockSeller);
    });

    it('should return cached seller when cache hit', async () => {
      cacheService.get.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      const result = await service.getSellerByUserId(100);

      expect(cacheService.get).toHaveBeenCalledWith('seller:userId:100');
      expect(repository.findByUserId).not.toHaveBeenCalled();
      expect(result).toEqual(mockSeller);
    });

    it('should throw NotFoundException when seller not found', async () => {
      cacheService.get.mockResolvedValue(null);
      repository.findByUserId.mockResolvedValue(null);

      await expect(service.getSellerByUserId(999)).rejects.toThrow(NotFoundException);
      await expect(service.getSellerByUserId(999)).rejects.toThrow('Seller not found for user 999');
    });
  });

  describe('getAllSellers', () => {
    it('should return sellers and total count', async () => {
      const mockSellers = [mockSeller, { ...mockSeller, id: 2 }];
      repository.findAll.mockResolvedValue(mockSellers as SellerTypeOrmEntity[]);
      repository.count.mockResolvedValue(2);

      const result = await service.getAllSellers({ limit: 10, offset: 0 });

      expect(result.sellers).toEqual(mockSellers);
      expect(result.total).toBe(2);
    });
  });

  describe('updateProfile', () => {
    const updateDto: UpdateSellerProfileDto = {
      logoUrl: 'https://example.com/logo.png',
      description: 'Updated description',
      website: 'https://example.com',
    };

    it('should update seller profile', async () => {
      const updatedSeller = { ...mockSeller, ...updateDto };
      repository.findById.mockResolvedValue(mockSeller as SellerTypeOrmEntity);
      repository.update.mockResolvedValue(updatedSeller as SellerTypeOrmEntity);

      const result = await service.updateProfile(1, updateDto);

      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedSeller);
    });

    it('should throw BadRequestException if seller is suspended', async () => {
      const suspendedSeller = { ...mockSeller, status: SellerStatus.SUSPENDED };
      repository.findById.mockResolvedValue(suspendedSeller as SellerTypeOrmEntity);

      await expect(service.updateProfile(1, updateDto)).rejects.toThrow(BadRequestException);
      await expect(service.updateProfile(1, updateDto)).rejects.toThrow(
        'Cannot update profile while account is suspended',
      );
    });
  });

  describe('updateBankingInfo', () => {
    const bankingDto: UpdateBankingInfoDto = {
      bankName: 'Test Bank',
      bankAccountHolder: 'John Doe',
      bankAccountNumber: '123456789',
      bankRoutingNumber: '987654321',
    };

    it('should update banking information', async () => {
      const updatedSeller = { ...mockSeller, ...bankingDto };
      repository.findById.mockResolvedValue(mockSeller as SellerTypeOrmEntity);
      repository.update.mockResolvedValue(updatedSeller as SellerTypeOrmEntity);

      const result = await service.updateBankingInfo(1, bankingDto);

      expect(repository.update).toHaveBeenCalledWith(1, bankingDto);
      expect(result).toEqual(updatedSeller);
    });

    it('should throw BadRequestException if seller is suspended', async () => {
      const suspendedSeller = { ...mockSeller, status: SellerStatus.SUSPENDED };
      repository.findById.mockResolvedValue(suspendedSeller as SellerTypeOrmEntity);

      await expect(service.updateBankingInfo(1, bankingDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('submitForVerification', () => {
    it('should change verification status from unverified to pending', async () => {
      const sellerWithAllInfo = { ...mockSeller, businessPostalCode: '12345' };
      repository.findById.mockResolvedValue(sellerWithAllInfo as SellerTypeOrmEntity);
      repository.update.mockResolvedValue({
        ...sellerWithAllInfo,
        verificationStatus: VerificationStatus.PENDING,
      } as SellerTypeOrmEntity);

      const result = await service.submitForVerification(1);

      expect(repository.update).toHaveBeenCalledWith(1, {
        verificationStatus: VerificationStatus.PENDING,
      });
      expect(result.verificationStatus).toBe(VerificationStatus.PENDING);
    });

    it('should throw BadRequestException if already pending', async () => {
      const pendingSeller = { ...mockSeller, verificationStatus: VerificationStatus.PENDING };
      repository.findById.mockResolvedValue(pendingSeller as SellerTypeOrmEntity);

      await expect(service.submitForVerification(1)).rejects.toThrow(BadRequestException);
      await expect(service.submitForVerification(1)).rejects.toThrow(
        'Verification is already pending',
      );
    });

    it('should throw BadRequestException if already verified', async () => {
      const verifiedSeller = { ...mockSeller, verificationStatus: VerificationStatus.VERIFIED };
      repository.findById.mockResolvedValue(verifiedSeller as SellerTypeOrmEntity);

      await expect(service.submitForVerification(1)).rejects.toThrow(BadRequestException);
      await expect(service.submitForVerification(1)).rejects.toThrow('Seller is already verified');
    });

    it('should throw BadRequestException if missing required fields', async () => {
      const incompleteSeller = { ...mockSeller, businessAddress: null };
      repository.findById.mockResolvedValue(incompleteSeller as SellerTypeOrmEntity);

      await expect(service.submitForVerification(1)).rejects.toThrow(BadRequestException);
      await expect(service.submitForVerification(1)).rejects.toThrow(/Missing required fields/);
    });
  });

  describe('approveSeller', () => {
    it('should approve pending seller and activate account', async () => {
      const pendingSeller = {
        ...mockSeller,
        verificationStatus: VerificationStatus.PENDING,
      };
      const now = new Date();
      const approvedSeller = {
        ...pendingSeller,
        verificationStatus: VerificationStatus.VERIFIED,
        status: SellerStatus.ACTIVE,
        verifiedAt: now,
        verifiedBy: 200,
      };

      repository.findById.mockResolvedValue(pendingSeller as SellerTypeOrmEntity);
      repository.update.mockResolvedValue(approvedSeller as SellerTypeOrmEntity);

      const result = await service.approveSeller(1, 200);

      expect(repository.update).toHaveBeenCalledWith(1, {
        verificationStatus: VerificationStatus.VERIFIED,
        status: SellerStatus.ACTIVE,
        verifiedAt: expect.any(Date),
        verifiedBy: 200,
        rejectionReason: null,
      });
      expect(result.verificationStatus).toBe(VerificationStatus.VERIFIED);
      expect(result.status).toBe(SellerStatus.ACTIVE);
    });

    it('should throw BadRequestException if not in pending status', async () => {
      repository.findById.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      await expect(service.approveSeller(1, 200)).rejects.toThrow(BadRequestException);
      await expect(service.approveSeller(1, 200)).rejects.toThrow(
        'Seller must be in pending verification status',
      );
    });
  });

  describe('rejectSeller', () => {
    it('should reject pending seller with reason', async () => {
      const pendingSeller = {
        ...mockSeller,
        verificationStatus: VerificationStatus.PENDING,
      };
      const rejectedSeller = {
        ...pendingSeller,
        verificationStatus: VerificationStatus.REJECTED,
        status: SellerStatus.REJECTED,
        rejectionReason: 'Incomplete documents',
      };

      repository.findById.mockResolvedValue(pendingSeller as SellerTypeOrmEntity);
      repository.update.mockResolvedValue(rejectedSeller as SellerTypeOrmEntity);

      const result = await service.rejectSeller(1, 'Incomplete documents');

      expect(repository.update).toHaveBeenCalledWith(1, {
        verificationStatus: VerificationStatus.REJECTED,
        status: SellerStatus.REJECTED,
        rejectionReason: 'Incomplete documents',
      });
      expect(result.verificationStatus).toBe(VerificationStatus.REJECTED);
      expect(result.status).toBe(SellerStatus.REJECTED);
    });

    it('should throw BadRequestException if not in pending status', async () => {
      repository.findById.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      await expect(service.rejectSeller(1, 'reason')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if reason is empty', async () => {
      const pendingSeller = { ...mockSeller, verificationStatus: VerificationStatus.PENDING };
      repository.findById.mockResolvedValue(pendingSeller as SellerTypeOrmEntity);

      await expect(service.rejectSeller(1, '')).rejects.toThrow(BadRequestException);
      await expect(service.rejectSeller(1, '')).rejects.toThrow('Rejection reason is required');
    });
  });

  describe('suspendSeller', () => {
    it('should suspend active seller with reason', async () => {
      const activeSeller = {
        ...mockSeller,
        status: SellerStatus.ACTIVE,
        verificationStatus: VerificationStatus.VERIFIED,
      };
      const suspendedSeller = {
        ...activeSeller,
        status: SellerStatus.SUSPENDED,
        suspensionReason: 'Policy violation',
      };

      repository.findById.mockResolvedValue(activeSeller as SellerTypeOrmEntity);
      repository.update.mockResolvedValue(suspendedSeller as SellerTypeOrmEntity);

      const result = await service.suspendSeller(1, 'Policy violation');

      expect(repository.update).toHaveBeenCalledWith(1, {
        status: SellerStatus.SUSPENDED,
        suspensionReason: 'Policy violation',
      });
      expect(result.status).toBe(SellerStatus.SUSPENDED);
    });

    it('should throw BadRequestException if already suspended', async () => {
      const suspendedSeller = { ...mockSeller, status: SellerStatus.SUSPENDED };
      repository.findById.mockResolvedValue(suspendedSeller as SellerTypeOrmEntity);

      await expect(service.suspendSeller(1, 'reason')).rejects.toThrow(BadRequestException);
      await expect(service.suspendSeller(1, 'reason')).rejects.toThrow(
        'Seller is already suspended',
      );
    });

    it('should throw BadRequestException if reason is empty', async () => {
      const activeSeller = { ...mockSeller, status: SellerStatus.ACTIVE };
      repository.findById.mockResolvedValue(activeSeller as SellerTypeOrmEntity);

      await expect(service.suspendSeller(1, '')).rejects.toThrow(BadRequestException);
      await expect(service.suspendSeller(1, '')).rejects.toThrow('Suspension reason is required');
    });
  });

  describe('reactivateSeller', () => {
    it('should reactivate suspended seller if verified', async () => {
      const suspendedSeller = {
        ...mockSeller,
        status: SellerStatus.SUSPENDED,
        verificationStatus: VerificationStatus.VERIFIED,
        suspensionReason: 'Old violation',
      };
      const reactivatedSeller = {
        ...suspendedSeller,
        status: SellerStatus.ACTIVE,
        suspensionReason: null,
      };

      repository.findById.mockResolvedValue(suspendedSeller as SellerTypeOrmEntity);
      repository.update.mockResolvedValue(reactivatedSeller as SellerTypeOrmEntity);

      const result = await service.reactivateSeller(1);

      expect(repository.update).toHaveBeenCalledWith(1, {
        status: SellerStatus.ACTIVE,
        suspensionReason: null,
      });
      expect(result.status).toBe(SellerStatus.ACTIVE);
    });

    it('should throw BadRequestException if not suspended', async () => {
      const activeSeller = { ...mockSeller, status: SellerStatus.ACTIVE };
      repository.findById.mockResolvedValue(activeSeller as SellerTypeOrmEntity);

      await expect(service.reactivateSeller(1)).rejects.toThrow(BadRequestException);
      await expect(service.reactivateSeller(1)).rejects.toThrow('Seller is not suspended');
    });

    it('should throw BadRequestException if not verified', async () => {
      const suspendedUnverified = {
        ...mockSeller,
        status: SellerStatus.SUSPENDED,
        verificationStatus: VerificationStatus.UNVERIFIED,
      };
      repository.findById.mockResolvedValue(suspendedUnverified as SellerTypeOrmEntity);

      await expect(service.reactivateSeller(1)).rejects.toThrow(BadRequestException);
      await expect(service.reactivateSeller(1)).rejects.toThrow(
        'Seller must be verified to be reactivated',
      );
    });
  });

  describe('metrics updates', () => {
    it('should increment product count', async () => {
      repository.findById.mockResolvedValue(mockSeller as SellerTypeOrmEntity);
      repository.update.mockResolvedValue({
        ...mockSeller,
        totalProducts: 1,
      } as SellerTypeOrmEntity);

      await service.incrementProductCount(1);

      expect(repository.update).toHaveBeenCalledWith(1, { totalProducts: 1 });
    });

    it('should decrement product count', async () => {
      const sellerWithProducts = { ...mockSeller, totalProducts: 5 };
      repository.findById.mockResolvedValue(sellerWithProducts as SellerTypeOrmEntity);
      repository.update.mockResolvedValue({
        ...sellerWithProducts,
        totalProducts: 4,
      } as SellerTypeOrmEntity);

      await service.decrementProductCount(1);

      expect(repository.update).toHaveBeenCalledWith(1, { totalProducts: 4 });
    });

    it('should not decrement product count below 0', async () => {
      repository.findById.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      await service.decrementProductCount(1);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should record sale with amount', async () => {
      repository.findById.mockResolvedValue(mockSeller as SellerTypeOrmEntity);
      repository.update.mockResolvedValue({
        ...mockSeller,
        totalSales: 1,
        totalRevenue: 99.99,
      } as SellerTypeOrmEntity);

      await service.recordSale(1, 99.99);

      expect(repository.update).toHaveBeenCalledWith(1, {
        totalSales: 1,
        totalRevenue: 99.99,
      });
    });

    it('should update rating and review count', async () => {
      repository.update.mockResolvedValue({
        ...mockSeller,
        rating: 4.5,
        totalReviews: 10,
      } as SellerTypeOrmEntity);

      await service.updateRating(1, 4.5, 10);

      expect(repository.update).toHaveBeenCalledWith(1, {
        rating: 4.5,
        totalReviews: 10,
      });
    });
  });

  describe('deleteSeller', () => {
    it('should delete seller with no products or sales', async () => {
      repository.findById.mockResolvedValue(mockSeller as SellerTypeOrmEntity);
      repository.delete.mockResolvedValue(undefined);

      await service.deleteSeller(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if seller has products', async () => {
      const sellerWithProducts = { ...mockSeller, totalProducts: 5 };
      repository.findById.mockResolvedValue(sellerWithProducts as SellerTypeOrmEntity);

      await expect(service.deleteSeller(1)).rejects.toThrow(BadRequestException);
      await expect(service.deleteSeller(1)).rejects.toThrow(
        'Cannot delete seller with existing products',
      );
    });

    it('should throw BadRequestException if seller has sales', async () => {
      const sellerWithSales = { ...mockSeller, totalSales: 10 };
      repository.findById.mockResolvedValue(sellerWithSales as SellerTypeOrmEntity);

      await expect(service.deleteSeller(1)).rejects.toThrow(BadRequestException);
      await expect(service.deleteSeller(1)).rejects.toThrow(
        'Cannot delete seller with sales history',
      );
    });
  });

  describe('validateSellerActive', () => {
    it('should return true for active verified seller', async () => {
      const activeSeller = {
        ...mockSeller,
        status: SellerStatus.ACTIVE,
        verificationStatus: VerificationStatus.VERIFIED,
      };
      repository.findById.mockResolvedValue(activeSeller as SellerTypeOrmEntity);

      const result = await service.validateSellerActive(1);

      expect(result).toBe(true);
    });

    it('should throw BadRequestException if seller is not active', async () => {
      const suspendedSeller = { ...mockSeller, status: SellerStatus.SUSPENDED };
      repository.findById.mockResolvedValue(suspendedSeller as SellerTypeOrmEntity);

      await expect(service.validateSellerActive(1)).rejects.toThrow(BadRequestException);
      await expect(service.validateSellerActive(1)).rejects.toThrow(/Seller account is/);
    });

    it('should throw BadRequestException if seller is not verified', async () => {
      const unverifiedSeller = {
        ...mockSeller,
        status: SellerStatus.ACTIVE,
        verificationStatus: VerificationStatus.UNVERIFIED,
      };
      repository.findById.mockResolvedValue(unverifiedSeller as SellerTypeOrmEntity);

      await expect(service.validateSellerActive(1)).rejects.toThrow(BadRequestException);
      await expect(service.validateSellerActive(1)).rejects.toThrow(
        'Seller must be verified to perform this action',
      );
    });
  });

  describe('getPendingVerification', () => {
    it('should return list of pending sellers', async () => {
      const pendingSellers = [
        { ...mockSeller, id: 1, verificationStatus: VerificationStatus.PENDING },
        { ...mockSeller, id: 2, verificationStatus: VerificationStatus.PENDING },
      ];
      repository.findPendingVerification.mockResolvedValue(pendingSellers as SellerTypeOrmEntity[]);

      const result = await service.getPendingVerification();

      expect(result).toEqual(pendingSellers);
      expect(repository.findPendingVerification).toHaveBeenCalled();
    });
  });

  describe('Analytics - getSellerAnalytics', () => {
    const mockSellerWithMetrics: Partial<SellerTypeOrmEntity> = {
      ...mockSeller,
      id: 1,
      businessName: 'Analytics Test Store',
      status: SellerStatus.ACTIVE,
      verificationStatus: VerificationStatus.VERIFIED,
      totalProducts: 50,
      totalSales: 100,
      totalRevenue: 10000,
      rating: 4.5,
      totalReviews: 75,
      verifiedAt: new Date('2024-01-01'),
      createdAt: new Date('2023-01-01'),
    };

    it('should return analytics overview for all_time period', async () => {
      repository.findById.mockResolvedValue(mockSellerWithMetrics as SellerTypeOrmEntity);

      const result = await service.getSellerAnalytics(1, 'all_time');

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result.sellerId).toBe(1);
      expect(result.businessName).toBe('Analytics Test Store');
      expect(result.totalProducts).toBe(50);
      expect(result.totalSales).toBe(100);
      expect(result.totalRevenue).toBe(10000);
      expect(result.rating).toBe(4.5);
      expect(result.totalReviews).toBe(75);
      expect(result.period).toBe('all_time');
      expect(result.periodRevenue).toBe(10000);
      expect(result.periodSales).toBe(100);
      expect(result.averageOrderValue).toBe(100); // 10000 / 100
    });

    it('should calculate average order value correctly', async () => {
      const sellerData = {
        ...mockSellerWithMetrics,
        totalSales: 50,
        totalRevenue: 5000,
      };
      repository.findById.mockResolvedValue(sellerData as SellerTypeOrmEntity);

      const result = await service.getSellerAnalytics(1, 'month');

      expect(result.averageOrderValue).toBe(100); // 5000 / 50
      expect(result.period).toBe('month');
    });

    it('should handle zero sales gracefully', async () => {
      const sellerData = {
        ...mockSellerWithMetrics,
        totalSales: 0,
        totalRevenue: 0,
      };
      repository.findById.mockResolvedValue(sellerData as SellerTypeOrmEntity);

      const result = await service.getSellerAnalytics(1);

      expect(result.averageOrderValue).toBe(0);
      expect(result.periodSales).toBe(0);
      expect(result.periodRevenue).toBe(0);
    });

    it('should support different time periods', async () => {
      repository.findById.mockResolvedValue(mockSellerWithMetrics as SellerTypeOrmEntity);

      const periods: Array<'day' | 'week' | 'month' | 'year' | 'all_time'> = [
        'day',
        'week',
        'month',
        'year',
        'all_time',
      ];

      for (const period of periods) {
        const result = await service.getSellerAnalytics(1, period);
        expect(result.period).toBe(period);
        expect(result.periodStart).toBeInstanceOf(Date);
        expect(result.periodEnd).toBeInstanceOf(Date);
      }
    });

    it('should support custom date ranges', async () => {
      repository.findById.mockResolvedValue(mockSellerWithMetrics as SellerTypeOrmEntity);

      const customStart = new Date('2024-01-01');
      const customEnd = new Date('2024-12-31');

      const result = await service.getSellerAnalytics(1, 'month', customStart, customEnd);

      expect(result.periodStart).toEqual(customStart);
      expect(result.periodEnd).toEqual(customEnd);
    });

    it('should throw NotFoundException if seller not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getSellerAnalytics(999)).rejects.toThrow(NotFoundException);
      await expect(service.getSellerAnalytics(999)).rejects.toThrow('Seller with id 999 not found');
    });
  });

  describe('Analytics - getSalesTrend', () => {
    const mockSellerWithSales: Partial<SellerTypeOrmEntity> = {
      ...mockSeller,
      id: 1,
      totalSales: 300,
      totalRevenue: 30000,
    };

    it('should return sales trend data for month period', async () => {
      repository.findById.mockResolvedValue(mockSellerWithSales as SellerTypeOrmEntity);

      const result = await service.getSalesTrend(1, 'month');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Check structure of first data point
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('sales');
      expect(result[0]).toHaveProperty('revenue');
      expect(result[0]).toHaveProperty('orders');
      expect(result[0]).toHaveProperty('averageOrderValue');
      
      // Check date format (YYYY-MM-DD)
      expect(result[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return data points for different periods', async () => {
      repository.findById.mockResolvedValue(mockSellerWithSales as SellerTypeOrmEntity);

      const dayResult = await service.getSalesTrend(1, 'day');
      const weekResult = await service.getSalesTrend(1, 'week');
      const monthResult = await service.getSalesTrend(1, 'month');
      const yearResult = await service.getSalesTrend(1, 'year');

      expect(dayResult.length).toBeGreaterThan(0);
      expect(weekResult.length).toBeGreaterThan(0);
      expect(monthResult.length).toBeGreaterThan(0);
      expect(yearResult.length).toBeGreaterThan(0);

      // Year should have more data points than day
      expect(yearResult.length).toBeGreaterThan(dayResult.length);
    });

    it('should calculate average order value per data point', async () => {
      repository.findById.mockResolvedValue(mockSellerWithSales as SellerTypeOrmEntity);

      const result = await service.getSalesTrend(1, 'week');

      result.forEach((dataPoint) => {
        if (dataPoint.orders > 0) {
          const expectedAvg = parseFloat((dataPoint.revenue / dataPoint.orders).toFixed(2));
          expect(dataPoint.averageOrderValue).toBe(expectedAvg);
        } else {
          expect(dataPoint.averageOrderValue).toBe(0);
        }
      });
    });

    it('should support custom date ranges', async () => {
      repository.findById.mockResolvedValue(mockSellerWithSales as SellerTypeOrmEntity);

      const customStart = new Date('2024-06-01');
      const customEnd = new Date('2024-06-07');

      const result = await service.getSalesTrend(1, 'week', customStart, customEnd);

      expect(result.length).toBeGreaterThan(0);
      
      // First date should be on or after start date
      const firstDate = new Date(result[0].date);
      expect(firstDate.getTime()).toBeGreaterThanOrEqual(customStart.getTime());
    });

    it('should throw NotFoundException if seller not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getSalesTrend(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Analytics - getProductPerformance', () => {
    const mockSellerWithProducts: Partial<SellerTypeOrmEntity> = {
      ...mockSeller,
      id: 1,
      totalProducts: 25,
      totalSales: 500,
      rating: 4.2,
    };

    it('should return product performance metrics', async () => {
      repository.findById.mockResolvedValue(mockSellerWithProducts as SellerTypeOrmEntity);

      const result = await service.getProductPerformance(1);

      expect(result).toHaveProperty('totalProducts');
      expect(result).toHaveProperty('activeProducts');
      expect(result).toHaveProperty('outOfStockProducts');
      expect(result).toHaveProperty('topProducts');
      expect(result).toHaveProperty('averageRating');
      expect(result).toHaveProperty('totalViews');
      expect(result).toHaveProperty('newProductsThisPeriod');
      
      expect(result.totalProducts).toBe(25);
      expect(result.averageRating).toBe(4.2);
      expect(Array.isArray(result.topProducts)).toBe(true);
    });

    it('should include top products sorted by revenue', async () => {
      repository.findById.mockResolvedValue(mockSellerWithProducts as SellerTypeOrmEntity);

      const result = await service.getProductPerformance(1);

      expect(result.topProducts.length).toBeGreaterThan(0);
      expect(result.topProducts.length).toBeLessThanOrEqual(5);
      
      // Check each top product has required properties
      result.topProducts.forEach((product: any) => {
        expect(product).toHaveProperty('productId');
        expect(product).toHaveProperty('productName');
        expect(product).toHaveProperty('unitsSold');
        expect(product).toHaveProperty('revenue');
        expect(product).toHaveProperty('rating');
        expect(product).toHaveProperty('reviewCount');
      });

      // Verify sorted by revenue (descending)
      for (let i = 0; i < result.topProducts.length - 1; i++) {
        expect(result.topProducts[i].revenue).toBeGreaterThanOrEqual(
          result.topProducts[i + 1].revenue,
        );
      }
    });

    it('should throw NotFoundException if seller not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getProductPerformance(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Analytics - getRevenueBreakdown', () => {
    const mockSellerWithRevenue: Partial<SellerTypeOrmEntity> = {
      ...mockSeller,
      id: 1,
      totalSales: 200,
      totalRevenue: 25000,
    };

    it('should return revenue breakdown', async () => {
      repository.findById.mockResolvedValue(mockSellerWithRevenue as SellerTypeOrmEntity);

      const result = await service.getRevenueBreakdown(1);

      expect(result).toHaveProperty('totalRevenue');
      expect(result).toHaveProperty('completedRevenue');
      expect(result).toHaveProperty('pendingRevenue');
      expect(result).toHaveProperty('refundedAmount');
      expect(result).toHaveProperty('averageOrderValue');
      expect(result).toHaveProperty('highestOrderValue');
      expect(result).toHaveProperty('lowestOrderValue');
      expect(result).toHaveProperty('revenueByCategory');
      
      expect(result.totalRevenue).toBe(25000);
      expect(result.averageOrderValue).toBe(125); // 25000 / 200
    });

    it('should include revenue breakdown by category', async () => {
      repository.findById.mockResolvedValue(mockSellerWithRevenue as SellerTypeOrmEntity);

      const result = await service.getRevenueBreakdown(1);

      expect(typeof result.revenueByCategory).toBe('object');
      expect(Object.keys(result.revenueByCategory).length).toBeGreaterThan(0);
      
      // Verify all category values are numbers
      Object.values(result.revenueByCategory).forEach((value) => {
        expect(typeof value).toBe('number');
      });
    });

    it('should throw NotFoundException if seller not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getRevenueBreakdown(999)).rejects.toThrow(NotFoundException);
    });
  });
});
