import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApproveSellerUseCase } from './approve-seller.use-case';
import { GetSellerByIdUseCase } from './get-seller-by-id.use-case';
import { SellerRepository } from '../../infrastructure/database/typeorm/repositories/seller.repository';
import { SellerCacheService } from '../services/seller-cache.service';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { SellerTypeOrmEntity, SellerStatus, VerificationStatus } from '../../infrastructure/database/typeorm/entities/seller.entity';

describe('ApproveSellerUseCase', () => {
  let useCase: ApproveSellerUseCase;
  let getSellerByIdUseCase: jest.Mocked<GetSellerByIdUseCase>;
  let sellerRepository: jest.Mocked<SellerRepository>;
  let sellerCacheService: jest.Mocked<SellerCacheService>;
  let logger: jest.Mocked<WinstonLoggerService>;

  const mockPendingSeller: SellerTypeOrmEntity = {
    id: 1,
    userId: 1,
    businessName: 'Test Business',
    businessEmail: 'business@example.com',
    status: SellerStatus.PENDING,
    verificationStatus: VerificationStatus.PENDING,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    rating: 0,
    commissionRate: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as SellerTypeOrmEntity;

  const mockApprovedSeller: SellerTypeOrmEntity = {
    ...mockPendingSeller,
    status: SellerStatus.ACTIVE,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: new Date(),
    verifiedBy: 100,
  } as SellerTypeOrmEntity;

  beforeEach(async () => {
    const mockGetSellerByIdUseCase = {
      execute: jest.fn(),
    };

    const mockSellerRepository = {
      update: jest.fn(),
    };

    const mockSellerCacheService = {
      invalidate: jest.fn(),
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
        ApproveSellerUseCase,
        { provide: GetSellerByIdUseCase, useValue: mockGetSellerByIdUseCase },
        { provide: SellerRepository, useValue: mockSellerRepository },
        { provide: SellerCacheService, useValue: mockSellerCacheService },
        { provide: WinstonLoggerService, useValue: mockLogger },
      ],
    }).compile();

    useCase = module.get<ApproveSellerUseCase>(ApproveSellerUseCase);
    getSellerByIdUseCase = module.get(GetSellerByIdUseCase);
    sellerRepository = module.get(SellerRepository);
    sellerCacheService = module.get(SellerCacheService);
    logger = module.get(WinstonLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully approve a pending seller', async () => {
      // Arrange
      getSellerByIdUseCase.execute.mockResolvedValue(mockPendingSeller);
      sellerRepository.update.mockResolvedValue(mockApprovedSeller);

      // Act
      const result = await useCase.execute(1, 100);

      // Assert
      expect(getSellerByIdUseCase.execute).toHaveBeenCalledWith(1);
      expect(sellerRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          status: SellerStatus.ACTIVE,
          verificationStatus: VerificationStatus.VERIFIED,
          verifiedBy: 100,
        }),
      );
      expect(sellerCacheService.invalidate).toHaveBeenCalledWith(mockApprovedSeller);
      expect(logger.logEvent).toHaveBeenCalledWith('seller_approved', expect.any(Object), '100');
      expect(result).toEqual(mockApprovedSeller);
    });

    it('should throw NotFoundException if seller does not exist', async () => {
      // Arrange
      getSellerByIdUseCase.execute.mockRejectedValue(new NotFoundException('Seller not found'));

      // Act & Assert
      await expect(useCase.execute(1, 100)).rejects.toThrow(NotFoundException);
      expect(getSellerByIdUseCase.execute).toHaveBeenCalledWith(1);
      expect(sellerRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if seller is not pending verification', async () => {
      // Arrange
      const activeSeller = { ...mockPendingSeller, verificationStatus: VerificationStatus.VERIFIED };
      getSellerByIdUseCase.execute.mockResolvedValue(activeSeller);

      // Act & Assert
      await expect(useCase.execute(1, 100)).rejects.toThrow(BadRequestException);
      expect(sellerRepository.update).not.toHaveBeenCalled();
    });

    it('should set verifiedAt timestamp', async () => {
      // Arrange
      const beforeTime = new Date();
      getSellerByIdUseCase.execute.mockResolvedValue(mockPendingSeller);
      sellerRepository.update.mockResolvedValue(mockApprovedSeller);

      // Act
      await useCase.execute(1, 100);
      const afterTime = new Date();

      // Assert
      const updateCall = sellerRepository.update.mock.calls[0];
      const updateData = updateCall[1];
      expect(updateData.verifiedAt).toBeDefined();
      expect(updateData.verifiedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(updateData.verifiedAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should invalidate cache after approval', async () => {
      // Arrange
      getSellerByIdUseCase.execute.mockResolvedValue(mockPendingSeller);
      sellerRepository.update.mockResolvedValue(mockApprovedSeller);

      // Act
      await useCase.execute(1, 100);

      // Assert
      expect(sellerCacheService.invalidate).toHaveBeenCalledWith(mockApprovedSeller);
      expect(sellerCacheService.invalidate).toHaveBeenCalledTimes(1);
    });
  });
});
