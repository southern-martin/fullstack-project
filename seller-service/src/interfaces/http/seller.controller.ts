import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { SellerService } from '../../domain/services/seller.service';
import { CreateSellerDto } from '../../application/dto/create-seller.dto';
import {
  UpdateSellerDto,
  UpdateSellerProfileDto,
  UpdateBankingInfoDto,
} from '../../application/dto/update-seller.dto';
import { SellerFilterDto } from '../../application/dto/seller-filter.dto';
import { AnalyticsQueryDto } from '../../application/dto/seller-analytics.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { SellerOwnerGuard } from '../../shared/guards/seller-owner.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('sellers')
@UseGuards(JwtAuthGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  /**
   * Register new seller
   * POST /api/v1/sellers
   * Auth: Required (any authenticated user)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerSeller(
    @CurrentUser('id') userId: number,
    @Body() createSellerDto: CreateSellerDto,
  ) {
    // Override userId from token (security - users can only create seller for themselves)
    return await this.sellerService.registerSeller(userId, {
      ...createSellerDto,
      userId,
    });
  }

  /**
   * Get all sellers (with filters)
   * GET /api/v1/sellers?status=active&limit=10&offset=0
   * Auth: Admin only
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllSellers(@Query() filters: SellerFilterDto) {
    return await this.sellerService.getAllSellers(filters);
  }

  /**
   * Get sellers pending verification
   * GET /api/v1/sellers/pending-verification
   * Auth: Admin only
   */
  @Get('pending-verification')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getPendingVerification() {
    return await this.sellerService.getPendingVerification();
  }

  /**
   * Get current user's seller account
   * GET /api/v1/sellers/me
   * Auth: Required
   */
  @Get('me')
  async getMySellerAccount(@CurrentUser('id') userId: number) {
    return await this.sellerService.getSellerByUserId(userId);
  }

  /**
   * Get seller by user ID
   * GET /api/v1/sellers/user/:userId
   * Auth: Admin or owner
   */
  @Get('user/:userId')
  async getSellerByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: any,
  ) {
    // Check if requesting own data or is admin
    if (currentUser.id !== userId && !currentUser.roles?.includes('admin')) {
      throw new Error('Forbidden');
    }
    return await this.sellerService.getSellerByUserId(userId);
  }

  /**
   * Get seller by ID
   * GET /api/v1/sellers/:id
   * Auth: Admin or owner
   */
  @Get(':id')
  @UseGuards(SellerOwnerGuard)
  async getSellerById(@Param('id', ParseIntPipe) id: number) {
    return await this.sellerService.getSellerById(id);
  }

  /**
   * Update seller profile (owner)
   * PATCH /api/v1/sellers/:id/profile
   * Auth: Owner only
   */
  @Patch(':id/profile')
  @UseGuards(SellerOwnerGuard)
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSellerProfileDto,
  ) {
    return await this.sellerService.updateProfile(id, updateDto);
  }

  /**
   * Update seller banking info (owner)
   * PATCH /api/v1/sellers/:id/banking
   * Auth: Owner only
   */
  @Patch(':id/banking')
  @UseGuards(SellerOwnerGuard)
  async updateBankingInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() bankingDto: UpdateBankingInfoDto,
  ) {
    return await this.sellerService.updateBankingInfo(id, bankingDto);
  }

  /**
   * Update seller (admin - full update including commission)
   * PATCH /api/v1/sellers/:id
   * Auth: Admin only
   */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async adminUpdateSeller(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSellerDto,
  ) {
    return await this.sellerService.adminUpdateSeller(id, updateDto);
  }

  /**
   * Submit seller for verification
   * POST /api/v1/sellers/:id/verify
   * Auth: Owner only
   */
  @Post(':id/verify')
  @UseGuards(SellerOwnerGuard)
  @HttpCode(HttpStatus.OK)
  async submitForVerification(@Param('id', ParseIntPipe) id: number) {
    return await this.sellerService.submitForVerification(id);
  }

  /**
   * Approve seller verification
   * POST /api/v1/sellers/:id/approve
   * Auth: Admin only
   */
  @Post(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async approveSeller(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') adminId: number) {
    return await this.sellerService.approveSeller(id, adminId);
  }

  /**
   * Reject seller verification
   * POST /api/v1/sellers/:id/reject
   * Auth: Admin only
   */
  @Post(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async rejectSeller(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string) {
    return await this.sellerService.rejectSeller(id, reason);
  }

  /**
   * Suspend seller
   * POST /api/v1/sellers/:id/suspend
   * Auth: Admin only
   */
  @Post(':id/suspend')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async suspendSeller(@Param('id', ParseIntPipe) id: number, @Body('reason') reason: string) {
    return await this.sellerService.suspendSeller(id, reason);
  }

  /**
   * Reactivate suspended seller
   * POST /api/v1/sellers/:id/reactivate
   * Auth: Admin only
   */
  @Post(':id/reactivate')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async reactivateSeller(@Param('id', ParseIntPipe) id: number) {
    return await this.sellerService.reactivateSeller(id);
  }

  /**
   * Delete seller
   * DELETE /api/v1/sellers/:id
   * Auth: Admin only
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSeller(@Param('id', ParseIntPipe) id: number) {
    await this.sellerService.deleteSeller(id);
  }

  /**
   * Get seller analytics overview
   * GET /api/v1/sellers/:id/analytics/overview
   * Auth: Owner or Admin
   * Query params: period (day|week|month|year|all_time), startDate, endDate
   */
  @Get(':id/analytics/overview')
  @UseGuards(SellerOwnerGuard)
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
   * Auth: Owner or Admin
   * Query params: period (day|week|month|year), startDate, endDate
   */
  @Get(':id/analytics/sales-trend')
  @UseGuards(SellerOwnerGuard)
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
   * Auth: Owner or Admin
   */
  @Get(':id/analytics/products')
  @UseGuards(SellerOwnerGuard)
  @HttpCode(HttpStatus.OK)
  async getProductPerformance(@Param('id', ParseIntPipe) id: number) {
    return await this.sellerService.getProductPerformance(id);
  }

  /**
   * Get revenue breakdown
   * GET /api/v1/sellers/:id/analytics/revenue
   * Auth: Owner or Admin
   * Query params: period (day|week|month|year)
   */
  @Get(':id/analytics/revenue')
  @UseGuards(SellerOwnerGuard)
  @HttpCode(HttpStatus.OK)
  async getRevenueBreakdown(
    @Param('id', ParseIntPipe) id: number,
    @Query('period') period: string = 'month',
  ) {
    return await this.sellerService.getRevenueBreakdown(id, period);
  }
}
