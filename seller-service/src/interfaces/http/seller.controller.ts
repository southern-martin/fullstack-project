import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateSellerDto } from '../../application/dto/create-seller.dto';
import {
  UpdateSellerDto,
  UpdateSellerProfileDto,
  UpdateBankingInfoDto,
} from '../../application/dto/update-seller.dto';
import { SellerFilterDto } from '../../application/dto/seller-filter.dto';
import { AnalyticsQueryDto } from '../../application/dto/seller-analytics.dto';
import { JwtDecoder } from '../../infrastructure/auth/jwt-decoder.service';

// Use Cases
import { RegisterSellerUseCase } from '../../application/use-cases/register-seller.use-case';
import { GetSellerByIdUseCase } from '../../application/use-cases/get-seller-by-id.use-case';
import { GetSellerByUserIdUseCase } from '../../application/use-cases/get-seller-by-user-id.use-case';
import { GetAllSellersUseCase } from '../../application/use-cases/get-all-sellers.use-case';
import { GetPendingVerificationUseCase } from '../../application/use-cases/get-pending-verification.use-case';
import { UpdateSellerProfileUseCase } from '../../application/use-cases/update-seller-profile.use-case';
import { UpdateBankingInfoUseCase } from '../../application/use-cases/update-banking-info.use-case';
import { SubmitForVerificationUseCase } from '../../application/use-cases/submit-for-verification.use-case';
import { ApproveSellerUseCase } from '../../application/use-cases/approve-seller.use-case';
import { RejectSellerUseCase } from '../../application/use-cases/reject-seller.use-case';
import { SuspendSellerUseCase } from '../../application/use-cases/suspend-seller.use-case';
import { ReactivateSellerUseCase } from '../../application/use-cases/reactivate-seller.use-case';
import { DeleteSellerUseCase } from '../../application/use-cases/delete-seller.use-case';
import { GetSellerAnalyticsUseCase } from '../../application/use-cases/analytics/get-seller-analytics.use-case';
import { GetSalesTrendUseCase } from '../../application/use-cases/analytics/get-sales-trend.use-case';
import { GetProductPerformanceUseCase } from '../../application/use-cases/analytics/get-product-performance.use-case';
import { GetRevenueBreakdownUseCase } from '../../application/use-cases/analytics/get-revenue-breakdown.use-case';

/**
 * Seller Controller
 * Clean Architecture - injects use cases instead of fat service
 */
@Controller('sellers')
export class SellerController {
  constructor(
    private readonly jwtDecoder: JwtDecoder,
    // CRUD Use Cases
    private readonly registerSellerUseCase: RegisterSellerUseCase,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
    private readonly getSellerByUserIdUseCase: GetSellerByUserIdUseCase,
    private readonly getAllSellersUseCase: GetAllSellersUseCase,
    private readonly getPendingVerificationUseCase: GetPendingVerificationUseCase,
    // Profile Update Use Cases
    private readonly updateSellerProfileUseCase: UpdateSellerProfileUseCase,
    private readonly updateBankingInfoUseCase: UpdateBankingInfoUseCase,
    // Verification Workflow Use Cases
    private readonly submitForVerificationUseCase: SubmitForVerificationUseCase,
    private readonly approveSellerUseCase: ApproveSellerUseCase,
    private readonly rejectSellerUseCase: RejectSellerUseCase,
    // Status Management Use Cases
    private readonly suspendSellerUseCase: SuspendSellerUseCase,
    private readonly reactivateSellerUseCase: ReactivateSellerUseCase,
    private readonly deleteSellerUseCase: DeleteSellerUseCase,
    // Analytics Use Cases
    private readonly getSellerAnalyticsUseCase: GetSellerAnalyticsUseCase,
    private readonly getSalesTrendUseCase: GetSalesTrendUseCase,
    private readonly getProductPerformanceUseCase: GetProductPerformanceUseCase,
    private readonly getRevenueBreakdownUseCase: GetRevenueBreakdownUseCase,
  ) {}

  /**
   * Register new seller
   * POST /api/v1/sellers
   * Auth: Required (Kong Gateway validates JWT)
   * Extracts user ID from JWT token
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerSeller(@Req() request: Request, @Body() createSellerDto: CreateSellerDto) {
    // Extract userId from JWT token (Kong validated, we decode to get claims)
    const authHeader = request.headers.authorization;
    const userId = this.jwtDecoder.getUserId(authHeader);

    // Override userId from token (security - users can only create seller for themselves)
    return await this.registerSellerUseCase.execute(userId, {
      ...createSellerDto,
      userId,
    });
  }

  /**
   * Get all sellers (with filters)
   * GET /api/v1/sellers?status=active&limit=10&offset=0
   * Auth: Kong Gateway validates JWT and role
   */
  @Get()
  async getAllSellers(@Query() filters: SellerFilterDto) {
    return await this.getAllSellersUseCase.execute(filters);
  }

  /**
   * Get sellers pending verification
   * GET /api/v1/sellers/pending-verification
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Get('pending-verification')
  async getPendingVerification() {
    return await this.getPendingVerificationUseCase.execute();
  }

  /**
   * Get current user's seller account
   * GET /api/v1/sellers/me
   * Auth: Kong Gateway validates JWT
   */
  @Get('me')
  async getMySellerAccount(@Req() request: Request) {
    const authHeader = request.headers.authorization;
    const userId = this.jwtDecoder.getUserId(authHeader);
    return await this.getSellerByUserIdUseCase.execute(userId);
  }

  /**
   * Get seller by user ID
   * GET /api/v1/sellers/user/:userId
   * Auth: Kong Gateway validates JWT
   * Note: Authorization logic moved to service layer
   */
  @Get('user/:userId')
  async getSellerByUserId(@Req() request: Request, @Param('userId', ParseIntPipe) userId: number) {
    // Get current user ID and roles from JWT
    const authHeader = request.headers.authorization;
    const currentUserId = this.jwtDecoder.getUserId(authHeader);
    const userRoles = this.jwtDecoder.getUserRoles(authHeader);

    // Check if requesting own data or is admin
    if (currentUserId !== userId && !userRoles.includes('admin')) {
      throw new Error('Forbidden');
    }
    return await this.getSellerByUserIdUseCase.execute(userId);
  }

  /**
   * Get seller by ID
   * GET /api/v1/sellers/:id
   * Auth: Kong Gateway validates JWT
   */
  @Get(':id')
  async getSellerById(@Param('id', ParseIntPipe) id: number) {
    return await this.getSellerByIdUseCase.execute(id);
  }

  /**
   * Update seller profile (owner)
   * PATCH /api/v1/sellers/:id/profile
   * Auth: Kong Gateway validates JWT
   */
  @Patch(':id/profile')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSellerProfileDto,
  ) {
    return await this.updateSellerProfileUseCase.execute(id, updateDto);
  }

  /**
   * Update seller banking info (owner)
   * PATCH /api/v1/sellers/:id/banking
   * Auth: Kong Gateway validates JWT
   */
  @Patch(':id/banking')
  async updateBankingInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() bankingDto: UpdateBankingInfoDto,
  ) {
    return await this.updateBankingInfoUseCase.execute(id, bankingDto);
  }

  /**
   * Update seller (admin - full update including commission)
   * PATCH /api/v1/sellers/:id
   * Auth: Kong Gateway validates JWT and admin role
   * 
   * Note: adminUpdateSeller use case not yet implemented
   * TODO: Create AdminUpdateSellerUseCase
   */
  @Patch(':id')
  async adminUpdateSeller(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSellerDto,
  ) {
    // Temporarily using updateProfile until AdminUpdateSellerUseCase is created
    return await this.updateSellerProfileUseCase.execute(id, updateDto);
  }

  /**
   * Submit seller for verification
   * POST /api/v1/sellers/:id/verify
   * Auth: Kong Gateway validates JWT
   */
  @Post(':id/verify')
  @HttpCode(HttpStatus.OK)
  async submitForVerification(@Param('id', ParseIntPipe) id: number) {
    return await this.submitForVerificationUseCase.execute(id);
  }

  /**
   * Approve seller verification
   * POST /api/v1/sellers/:id/approve
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approveSeller(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const authHeader = request.headers.authorization;
    const adminId = this.jwtDecoder.getUserId(authHeader);
    return await this.approveSellerUseCase.execute(id, adminId);
  }

  /**
   * Reject seller verification
   * POST /api/v1/sellers/:id/reject
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectSeller(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string) {
    return await this.rejectSellerUseCase.execute(id, reason);
  }

  /**
   * Suspend seller
   * POST /api/v1/sellers/:id/suspend
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Post(':id/suspend')
  @HttpCode(HttpStatus.OK)
  async suspendSeller(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string) {
    return await this.suspendSellerUseCase.execute(id, reason);
  }

  /**
   * Reactivate suspended seller
   * POST /api/v1/sellers/:id/reactivate
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Post(':id/reactivate')
  @HttpCode(HttpStatus.OK)
  async reactivateSeller(@Param('id', ParseIntPipe) id: number) {
    return await this.reactivateSellerUseCase.execute(id);
  }

  /**
   * Delete seller
   * DELETE /api/v1/sellers/:id
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSeller(@Param('id', ParseIntPipe) id: number) {
    await this.deleteSellerUseCase.execute(id);
  }

  /**
   * Get seller analytics overview
   * GET /api/v1/sellers/:id/analytics/overview
   * Auth: Kong Gateway validates JWT
   * Query params: period (day|week|month|year|all_time), startDate, endDate
   */
  @Get(':id/analytics/overview')
  @HttpCode(HttpStatus.OK)
  async getAnalyticsOverview(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: AnalyticsQueryDto,
  ) {
    const { period = 'all_time', startDate, endDate } = query;
    return await this.getSellerAnalyticsUseCase.execute(
      id,
      period,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  /**
   * Get seller sales trend
   * GET /api/v1/sellers/:id/analytics/sales-trend
   * Auth: Kong Gateway validates JWT
   * Query params: period (day|week|month|year), startDate, endDate
   */
  @Get(':id/analytics/sales-trend')
  @HttpCode(HttpStatus.OK)
  async getSalesTrend(@Param('id', ParseIntPipe) id: number, @Query() query: AnalyticsQueryDto) {
    const { period = 'month', startDate, endDate } = query;
    return await this.getSalesTrendUseCase.execute(
      id,
      period as 'day' | 'week' | 'month' | 'year',
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  /**
   * Get product performance analytics
   * GET /api/v1/sellers/:id/analytics/products
   * Auth: Kong Gateway validates JWT
   */
  @Get(':id/analytics/products')
  @HttpCode(HttpStatus.OK)
  async getProductPerformance(@Param('id', ParseIntPipe) id: number) {
    return await this.getProductPerformanceUseCase.execute(id);
  }

  /**
   * Get revenue breakdown
   * GET /api/v1/sellers/:id/analytics/revenue
   * Auth: Kong Gateway validates JWT
   * Query params: period (day|week|month|year)
   */
  @Get(':id/analytics/revenue')
  @HttpCode(HttpStatus.OK)
  async getRevenueBreakdown(
    @Param('id', ParseIntPipe) id: number,
    @Query('period') period: string = 'month',
  ) {
    return await this.getRevenueBreakdownUseCase.execute(id, period);
  }
}
