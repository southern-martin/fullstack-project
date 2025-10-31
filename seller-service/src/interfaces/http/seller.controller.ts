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
  Headers,
} from '@nestjs/common';
import { Request } from 'express';
import { SellerService } from '../../domain/services/seller.service';
import { CreateSellerDto } from '../../application/dto/create-seller.dto';
import {
  UpdateSellerDto,
  UpdateSellerProfileDto,
  UpdateBankingInfoDto,
} from '../../application/dto/update-seller.dto';
import { SellerFilterDto } from '../../application/dto/seller-filter.dto';
import { AnalyticsQueryDto } from '../../application/dto/seller-analytics.dto';
import { JwtDecoder } from '../../infrastructure/auth/jwt-decoder.service';

@Controller('sellers')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly jwtDecoder: JwtDecoder,
  ) {}

  /**
   * Register new seller
   * POST /api/v1/sellers
   * Auth: Required (Kong Gateway validates JWT)
   * Extracts user ID from JWT token
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerSeller(
    @Req() request: Request,
    @Body() createSellerDto: CreateSellerDto,
  ) {
    // Extract userId from JWT token (Kong validated, we decode to get claims)
    const authHeader = request.headers.authorization;
    const userId = this.jwtDecoder.getUserId(authHeader);
    
    // Override userId from token (security - users can only create seller for themselves)
    return await this.sellerService.registerSeller(userId, {
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
    return await this.sellerService.getAllSellers(filters);
  }

  /**
   * Get sellers pending verification
   * GET /api/v1/sellers/pending-verification
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Get('pending-verification')
  async getPendingVerification() {
    return await this.sellerService.getPendingVerification();
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
    return await this.sellerService.getSellerByUserId(userId);
  }

  /**
   * Get seller by user ID
   * GET /api/v1/sellers/user/:userId
   * Auth: Kong Gateway validates JWT
   * Note: Authorization logic moved to service layer
   */
  @Get('user/:userId')
  async getSellerByUserId(
    @Req() request: Request,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    // Get current user ID and roles from JWT
    const authHeader = request.headers.authorization;
    const currentUserId = this.jwtDecoder.getUserId(authHeader);
    const userRoles = this.jwtDecoder.getUserRoles(authHeader);
    
    // Check if requesting own data or is admin
    if (currentUserId !== userId && !userRoles.includes('admin')) {
      throw new Error('Forbidden');
    }
    return await this.sellerService.getSellerByUserId(userId);
  }

  /**
   * Get seller by ID
   * GET /api/v1/sellers/:id
   * Auth: Kong Gateway validates JWT
   */
  @Get(':id')
  async getSellerById(@Param('id', ParseIntPipe) id: number) {
    return await this.sellerService.getSellerById(id);
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
    return await this.sellerService.updateProfile(id, updateDto);
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
    return await this.sellerService.updateBankingInfo(id, bankingDto);
  }

  /**
   * Update seller (admin - full update including commission)
   * PATCH /api/v1/sellers/:id
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Patch(':id')
  async adminUpdateSeller(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSellerDto,
  ) {
    return await this.sellerService.adminUpdateSeller(id, updateDto);
  }

  /**
   * Submit seller for verification
   * POST /api/v1/sellers/:id/verify
   * Auth: Kong Gateway validates JWT
   */
  @Post(':id/verify')
  @HttpCode(HttpStatus.OK)
  async submitForVerification(@Param('id', ParseIntPipe) id: number) {
    return await this.sellerService.submitForVerification(id);
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
    return await this.sellerService.approveSeller(id, adminId);
  }

  /**
   * Reject seller verification
   * POST /api/v1/sellers/:id/reject
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectSeller(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string) {
    return await this.sellerService.rejectSeller(id, reason);
  }

  /**
   * Suspend seller
   * POST /api/v1/sellers/:id/suspend
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Post(':id/suspend')
  @HttpCode(HttpStatus.OK)
  async suspendSeller(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string) {
    return await this.sellerService.suspendSeller(id, reason);
  }

  /**
   * Reactivate suspended seller
   * POST /api/v1/sellers/:id/reactivate
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Post(':id/reactivate')
  @HttpCode(HttpStatus.OK)
  async reactivateSeller(@Param('id', ParseIntPipe) id: number) {
    return await this.sellerService.reactivateSeller(id);
  }

  /**
   * Delete seller
   * DELETE /api/v1/sellers/:id
   * Auth: Kong Gateway validates JWT and admin role
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSeller(@Param('id', ParseIntPipe) id: number) {
    await this.sellerService.deleteSeller(id);
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
    return await this.sellerService.getSellerAnalytics(
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
  async getSalesTrend(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: AnalyticsQueryDto,
  ) {
    const { period = 'month', startDate, endDate } = query;
    return await this.sellerService.getSalesTrend(
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
    return await this.sellerService.getProductPerformance(id);
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
    return await this.sellerService.getRevenueBreakdown(id, period);
  }
}
