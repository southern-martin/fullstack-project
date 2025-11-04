import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from '@fullstack-project/shared-infrastructure';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SellerRepository } from '../infrastructure/database/typeorm/repositories/seller.repository';
import { UserServiceClient } from '../infrastructure/external/user-service.client';

// Shared Application Services
import { SellerCacheService } from './services/seller-cache.service';
import { SellerValidationService } from './services/seller-validation.service';
import { AnalyticsHelperService } from './services/analytics-helper.service';

// CRUD Use Cases
import { RegisterSellerUseCase } from './use-cases/register-seller.use-case';
import { GetSellerByIdUseCase } from './use-cases/get-seller-by-id.use-case';
import { GetSellerByUserIdUseCase } from './use-cases/get-seller-by-user-id.use-case';
import { GetAllSellersUseCase } from './use-cases/get-all-sellers.use-case';
import { GetPendingVerificationUseCase } from './use-cases/get-pending-verification.use-case';

// Profile Update Use Cases
import { UpdateSellerProfileUseCase } from './use-cases/update-seller-profile.use-case';
import { UpdateBankingInfoUseCase } from './use-cases/update-banking-info.use-case';

// Verification Workflow Use Cases
import { SubmitForVerificationUseCase } from './use-cases/submit-for-verification.use-case';
import { ApproveSellerUseCase } from './use-cases/approve-seller.use-case';
import { RejectSellerUseCase } from './use-cases/reject-seller.use-case';

// Status Management Use Cases
import { SuspendSellerUseCase } from './use-cases/suspend-seller.use-case';
import { ReactivateSellerUseCase } from './use-cases/reactivate-seller.use-case';
import { DeleteSellerUseCase } from './use-cases/delete-seller.use-case';

// Metrics Management Use Cases
import { IncrementProductCountUseCase } from './use-cases/increment-product-count.use-case';
import { DecrementProductCountUseCase } from './use-cases/decrement-product-count.use-case';
import { RecordSaleUseCase } from './use-cases/record-sale.use-case';
import { UpdateRatingUseCase } from './use-cases/update-rating.use-case';

// Analytics Use Cases
import { GetSellerAnalyticsUseCase } from './use-cases/analytics/get-seller-analytics.use-case';
import { GetSalesTrendUseCase } from './use-cases/analytics/get-sales-trend.use-case';
import { GetProductPerformanceUseCase } from './use-cases/analytics/get-product-performance.use-case';
import { GetRevenueBreakdownUseCase } from './use-cases/analytics/get-revenue-breakdown.use-case';

/**
 * Application Module
 * Clean Architecture application layer
 *
 * Orchestrates:
 * - Shared application services (cache, validation, analytics)
 * - Use cases (one per business operation)
 *
 * Benefits:
 * - Single Responsibility Principle (each use case = 1 operation)
 * - High testability (each use case independently testable)
 * - Clear dependencies (explicit constructor injection)
 * - Easy to maintain (separate files, no merge conflicts)
 */
@Module({
  imports: [ConfigModule, InfrastructureModule],
  providers: [
    // Token-based dependency injection for consistency with user-service
    {
      provide: 'SellerRepositoryInterface',
      useClass: SellerRepository,
    },
    {
      provide: 'UserServiceClientInterface',
      useClass: UserServiceClient,
    },
    {
      provide: 'WinstonLoggerService',
      useClass: WinstonLoggerService,
    },

    // Shared Application Services
    SellerCacheService,
    SellerValidationService,
    AnalyticsHelperService,

    // CRUD Use Cases
    RegisterSellerUseCase,
    GetSellerByIdUseCase,
    GetSellerByUserIdUseCase,
    GetAllSellersUseCase,
    GetPendingVerificationUseCase,

    // Profile Update Use Cases
    UpdateSellerProfileUseCase,
    UpdateBankingInfoUseCase,

    // Verification Workflow Use Cases
    SubmitForVerificationUseCase,
    ApproveSellerUseCase,
    RejectSellerUseCase,

    // Status Management Use Cases
    SuspendSellerUseCase,
    ReactivateSellerUseCase,
    DeleteSellerUseCase,

    // Metrics Management Use Cases
    IncrementProductCountUseCase,
    DecrementProductCountUseCase,
    RecordSaleUseCase,
    UpdateRatingUseCase,

    // Analytics Use Cases
    GetSellerAnalyticsUseCase,
    GetSalesTrendUseCase,
    GetProductPerformanceUseCase,
    GetRevenueBreakdownUseCase,
  ],
  exports: [
    // Export shared services for external use
    SellerCacheService,
    SellerValidationService,
    AnalyticsHelperService,

    // Export all use cases for controller injection
    RegisterSellerUseCase,
    GetSellerByIdUseCase,
    GetSellerByUserIdUseCase,
    GetAllSellersUseCase,
    GetPendingVerificationUseCase,
    UpdateSellerProfileUseCase,
    UpdateBankingInfoUseCase,
    SubmitForVerificationUseCase,
    ApproveSellerUseCase,
    RejectSellerUseCase,
    SuspendSellerUseCase,
    ReactivateSellerUseCase,
    DeleteSellerUseCase,
    IncrementProductCountUseCase,
    DecrementProductCountUseCase,
    RecordSaleUseCase,
    UpdateRatingUseCase,
    GetSellerAnalyticsUseCase,
    GetSalesTrendUseCase,
    GetProductPerformanceUseCase,
    GetRevenueBreakdownUseCase,
  ],
})
export class ApplicationModule {}
