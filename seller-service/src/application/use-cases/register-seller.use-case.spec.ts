import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RegisterSellerUseCase } from './register-seller.use-case';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { UserServiceClient } from '../../infrastructure/external/user-service.client';
import { SellerCacheService } from '../services/seller-cache.service';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { CreateSellerDto } from '../dto/create-seller.dto';
import {
  SellerTypeOrmEntity,
  SellerStatus,
  VerificationStatus,
  BusinessType,
} from '../../infrastructure/database/typeorm/entities/seller.entity';

describe('RegisterSellerUseCase', () => {
  let useCase: RegisterSellerUseCase;
  let sellerRepository: jest.Mocked<SellerRepository>;
  let userServiceClient: jest.Mocked<UserServiceClient>;
  let sellerCacheService: jest.Mocked<SellerCacheService>;
  let logger: jest.Mocked<WinstonLoggerService>;

  const mockSeller: SellerTypeOrmEntity = {
    id: 1,
    userId: 1,
    businessName: 'Test Business',
    businessEmail: 'business@example.com',
    businessPhone: '+1234567890',
    status: SellerStatus.PENDING,
    verificationStatus: VerificationStatus.UNVERIFIED,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    rating: 0,
    commissionRate: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as SellerTypeOrmEntity;

  beforeEach(async () => {
    const mockSellerRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
    };

    const mockUserServiceClient = {
      validateUser: jest.fn(),
    };

    const mockSellerCacheService = {
      cacheSeller: jest.fn(),
    };

    const mockLogger = {
      setContext: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      logEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterSellerUseCase,
        { provide: SellerRepository, useValue: mockSellerRepository },
        { provide: UserServiceClient, useValue: mockUserServiceClient },
        { provide: SellerCacheService, useValue: mockSellerCacheService },
        { provide: WinstonLoggerService, useValue: mockLogger },
      ],
    }).compile();

    useCase = module.get<RegisterSellerUseCase>(RegisterSellerUseCase);
    sellerRepository = module.get(SellerRepository);
    userServiceClient = module.get(UserServiceClient);
    sellerCacheService = module.get(SellerCacheService);
    logger = module.get(WinstonLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const dto: CreateSellerDto = {
      userId: 1,
      businessName: 'Test Business',
      businessEmail: 'business@example.com',
      businessPhone: '+1234567890',
      businessType: BusinessType.LLC,
      businessAddress: '123 Test Street',
      businessCity: 'Test City',
      businessState: 'Test State',
      businessCountry: 'Test Country',
    };

    it('should successfully register a new seller', async () => {
      // Arrange
      userServiceClient.validateUser.mockResolvedValue(true);
      sellerRepository.findByUserId.mockResolvedValue(null);
      sellerRepository.create.mockResolvedValue(mockSeller);

      // Act
      const result = await useCase.execute(1, dto);

      // Assert
      expect(userServiceClient.validateUser).toHaveBeenCalledWith(1);
      expect(sellerRepository.findByUserId).toHaveBeenCalledWith(1);
      expect(sellerRepository.create).toHaveBeenCalledWith({
        userId: 1,
        businessName: 'Test Business',
        businessEmail: 'business@example.com',
        businessPhone: '+1234567890',
        status: SellerStatus.PENDING,
        verificationStatus: VerificationStatus.UNVERIFIED,
        totalProducts: 0,
        totalSales: 0,
        totalRevenue: 0,
        rating: 0,
        commissionRate: 10,
      });
      expect(sellerCacheService.cacheSeller).toHaveBeenCalledWith(mockSeller);
      expect(logger.logEvent).toHaveBeenCalledWith('seller_registered', expect.any(Object));
      expect(result).toEqual(mockSeller);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      // Arrange
      userServiceClient.validateUser.mockRejectedValue(new NotFoundException('User not found'));

      // Act & Assert
      await expect(useCase.execute(1, dto)).rejects.toThrow(NotFoundException);
      expect(userServiceClient.validateUser).toHaveBeenCalledWith(1);
      expect(sellerRepository.findByUserId).not.toHaveBeenCalled();
      expect(sellerRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if seller already exists', async () => {
      // Arrange
      userServiceClient.validateUser.mockResolvedValue(true);
      sellerRepository.findByUserId.mockResolvedValue(mockSeller);

      // Act & Assert
      await expect(useCase.execute(1, dto)).rejects.toThrow(ConflictException);
      expect(userServiceClient.validateUser).toHaveBeenCalledWith(1);
      expect(sellerRepository.findByUserId).toHaveBeenCalledWith(1);
      expect(sellerRepository.create).not.toHaveBeenCalled();
    });

    it('should set default values correctly', async () => {
      // Arrange
      userServiceClient.validateUser.mockResolvedValue(true);
      sellerRepository.findByUserId.mockResolvedValue(null);
      sellerRepository.create.mockResolvedValue(mockSeller);

      // Act
      await useCase.execute(1, dto);

      // Assert
      expect(sellerRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: SellerStatus.PENDING,
          verificationStatus: VerificationStatus.UNVERIFIED,
          totalProducts: 0,
          totalSales: 0,
          totalRevenue: 0,
          rating: 0,
          commissionRate: 10,
        }),
      );
    });
  });
});
