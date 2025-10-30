import { Test, TestingModule } from '@nestjs/testing';
import { SellerController } from './seller.controller';
import { SellerService } from '../../domain/services/seller.service';
import { CreateSellerDto } from '../../application/dto/create-seller.dto';
import {
  UpdateSellerProfileDto,
  UpdateBankingInfoDto,
  UpdateSellerDto,
} from '../../application/dto/update-seller.dto';
import { SellerFilterDto } from '../../application/dto/seller-filter.dto';
import {
  SellerTypeOrmEntity,
  SellerStatus,
  VerificationStatus,
  BusinessType,
} from '../../infrastructure/database/typeorm/entities/seller.entity';

describe('SellerController', () => {
  let controller: SellerController;
  let service: jest.Mocked<SellerService>;

  const mockSeller: Partial<SellerTypeOrmEntity> = {
    id: 1,
    userId: 100,
    businessName: 'Test Business',
    businessType: BusinessType.LLC,
    businessEmail: 'test@business.com',
    status: SellerStatus.PENDING,
    verificationStatus: VerificationStatus.UNVERIFIED,
    rating: 0,
    totalReviews: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
  };

  const mockUser = {
    id: 100,
    email: 'user@example.com',
    roles: ['seller'],
  };

  const mockAdmin = {
    id: 200,
    email: 'admin@example.com',
    roles: ['admin'],
  };

  beforeEach(async () => {
    const mockService = {
      registerSeller: jest.fn(),
      getSellerById: jest.fn(),
      getSellerByUserId: jest.fn(),
      getAllSellers: jest.fn(),
      updateProfile: jest.fn(),
      updateBankingInfo: jest.fn(),
      adminUpdateSeller: jest.fn(),
      submitForVerification: jest.fn(),
      approveSeller: jest.fn(),
      rejectSeller: jest.fn(),
      suspendSeller: jest.fn(),
      reactivateSeller: jest.fn(),
      deleteSeller: jest.fn(),
      getPendingVerification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerController],
      providers: [
        {
          provide: SellerService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SellerController>(SellerController);
    service = module.get(SellerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerSeller', () => {
    it('should register a new seller', async () => {
      const createDto: CreateSellerDto = {
        userId: 100,
        businessName: 'Test Business',
        businessType: BusinessType.LLC,
        businessEmail: 'test@business.com',
        businessPhone: '+1234567890',
      };

      service.registerSeller.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      const result = await controller.registerSeller(100, createDto);

      expect(service.registerSeller).toHaveBeenCalledWith(
        100,
        expect.objectContaining({
          userId: 100,
          businessName: 'Test Business',
        }),
      );
      expect(result).toEqual(mockSeller);
    });
  });

  describe('getAllSellers', () => {
    it('should return paginated sellers list', async () => {
      const filters: SellerFilterDto = { limit: 10, offset: 0 };
      const mockResponse = {
        sellers: [mockSeller],
        total: 1,
      };

      service.getAllSellers.mockResolvedValue(mockResponse as any);

      const result = await controller.getAllSellers(filters);

      expect(service.getAllSellers).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPendingVerification', () => {
    it('should return pending sellers', async () => {
      const pendingSellers = [{ ...mockSeller, verificationStatus: VerificationStatus.PENDING }];

      service.getPendingVerification.mockResolvedValue(pendingSellers as SellerTypeOrmEntity[]);

      const result = await controller.getPendingVerification();

      expect(service.getPendingVerification).toHaveBeenCalled();
      expect(result).toEqual(pendingSellers);
    });
  });

  describe('getMySellerAccount', () => {
    it('should return current user seller account', async () => {
      service.getSellerByUserId.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      const result = await controller.getMySellerAccount(100);

      expect(service.getSellerByUserId).toHaveBeenCalledWith(100);
      expect(result).toEqual(mockSeller);
    });
  });

  describe('getSellerByUserId', () => {
    it('should return seller for own userId', async () => {
      service.getSellerByUserId.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      const result = await controller.getSellerByUserId(100, mockUser);

      expect(service.getSellerByUserId).toHaveBeenCalledWith(100);
      expect(result).toEqual(mockSeller);
    });

    it('should return seller for admin', async () => {
      service.getSellerByUserId.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      const result = await controller.getSellerByUserId(100, mockAdmin);

      expect(service.getSellerByUserId).toHaveBeenCalledWith(100);
      expect(result).toEqual(mockSeller);
    });

    it('should throw error for unauthorized access', async () => {
      const otherUser = { id: 999, roles: ['seller'] };

      await expect(controller.getSellerByUserId(100, otherUser)).rejects.toThrow();
    });
  });

  describe('getSellerById', () => {
    it('should return seller by id', async () => {
      service.getSellerById.mockResolvedValue(mockSeller as SellerTypeOrmEntity);

      const result = await controller.getSellerById(1);

      expect(service.getSellerById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSeller);
    });
  });

  describe('updateProfile', () => {
    it('should update seller profile', async () => {
      const updateDto: UpdateSellerProfileDto = {
        description: 'Updated description',
        website: 'https://updated.com',
      };

      const updatedSeller = { ...mockSeller, ...updateDto };
      service.updateProfile.mockResolvedValue(updatedSeller as SellerTypeOrmEntity);

      const result = await controller.updateProfile(1, updateDto);

      expect(service.updateProfile).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedSeller);
    });
  });

  describe('updateBankingInfo', () => {
    it('should update banking information', async () => {
      const bankingDto: UpdateBankingInfoDto = {
        bankName: 'Test Bank',
        bankAccountHolder: 'Test Business',
        bankAccountNumber: '123456789',
        bankRoutingNumber: '987654321',
      };

      const updatedSeller = { ...mockSeller, ...bankingDto };
      service.updateBankingInfo.mockResolvedValue(updatedSeller as SellerTypeOrmEntity);

      const result = await controller.updateBankingInfo(1, bankingDto);

      expect(service.updateBankingInfo).toHaveBeenCalledWith(1, bankingDto);
      expect(result).toEqual(updatedSeller);
    });
  });

  describe('adminUpdateSeller', () => {
    it('should allow admin to update seller', async () => {
      const updateDto: UpdateSellerDto = {
        commissionRate: 12.5,
      };

      const updatedSeller = { ...mockSeller, commissionRate: 12.5 };
      service.adminUpdateSeller.mockResolvedValue(updatedSeller as SellerTypeOrmEntity);

      const result = await controller.adminUpdateSeller(1, updateDto);

      expect(service.adminUpdateSeller).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedSeller);
    });
  });

  describe('submitForVerification', () => {
    it('should submit seller for verification', async () => {
      const pendingSeller = {
        ...mockSeller,
        verificationStatus: VerificationStatus.PENDING,
      };

      service.submitForVerification.mockResolvedValue(pendingSeller as SellerTypeOrmEntity);

      const result = await controller.submitForVerification(1);

      expect(service.submitForVerification).toHaveBeenCalledWith(1);
      expect(result.verificationStatus).toBe(VerificationStatus.PENDING);
    });
  });

  describe('approveSeller', () => {
    it('should approve seller verification', async () => {
      const approvedSeller = {
        ...mockSeller,
        status: SellerStatus.ACTIVE,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedBy: 200,
      };

      service.approveSeller.mockResolvedValue(approvedSeller as SellerTypeOrmEntity);

      const result = await controller.approveSeller(1, 200);

      expect(service.approveSeller).toHaveBeenCalledWith(1, 200);
      expect(result.status).toBe(SellerStatus.ACTIVE);
      expect(result.verificationStatus).toBe(VerificationStatus.VERIFIED);
    });
  });

  describe('rejectSeller', () => {
    it('should reject seller verification', async () => {
      const reason = 'Incomplete documentation';
      const rejectedSeller = {
        ...mockSeller,
        status: SellerStatus.REJECTED,
        verificationStatus: VerificationStatus.REJECTED,
        rejectionReason: reason,
      };

      service.rejectSeller.mockResolvedValue(rejectedSeller as SellerTypeOrmEntity);

      const result = await controller.rejectSeller(1, reason);

      expect(service.rejectSeller).toHaveBeenCalledWith(1, reason);
      expect(result.status).toBe(SellerStatus.REJECTED);
      expect(result.rejectionReason).toBe(reason);
    });
  });

  describe('suspendSeller', () => {
    it('should suspend seller', async () => {
      const reason = 'Policy violation';
      const suspendedSeller = {
        ...mockSeller,
        status: SellerStatus.SUSPENDED,
        suspensionReason: reason,
      };

      service.suspendSeller.mockResolvedValue(suspendedSeller as SellerTypeOrmEntity);

      const result = await controller.suspendSeller(1, reason);

      expect(service.suspendSeller).toHaveBeenCalledWith(1, reason);
      expect(result.status).toBe(SellerStatus.SUSPENDED);
      expect(result.suspensionReason).toBe(reason);
    });
  });

  describe('reactivateSeller', () => {
    it('should reactivate suspended seller', async () => {
      const reactivatedSeller = {
        ...mockSeller,
        status: SellerStatus.ACTIVE,
        verificationStatus: VerificationStatus.VERIFIED,
        suspensionReason: null,
      };

      service.reactivateSeller.mockResolvedValue(reactivatedSeller as SellerTypeOrmEntity);

      const result = await controller.reactivateSeller(1);

      expect(service.reactivateSeller).toHaveBeenCalledWith(1);
      expect(result.status).toBe(SellerStatus.ACTIVE);
    });
  });

  describe('deleteSeller', () => {
    it('should delete seller', async () => {
      service.deleteSeller.mockResolvedValue(undefined);

      await controller.deleteSeller(1);

      expect(service.deleteSeller).toHaveBeenCalledWith(1);
    });
  });
});
