import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginatedResponseDto, PaginationDto } from '../../../../shared/dto';
import { CreatePricingRuleDto } from '../../application/dto/create-pricing-rule.dto';
import { PricingRuleResponseDto } from '../../application/dto/pricing-rule-response.dto';
import { UpdatePricingRuleDto } from '../../application/dto/update-pricing-rule.dto';
import { CalculatePriceDto } from '../../application/dto/calculate-price.dto';
import { PriceCalculationResponseDto } from '../../application/dto/price-calculation-response.dto';
import { CalculatePriceUseCase } from '../../application/use-cases/calculate-price.use-case';
import { ManagePricingRuleUseCase } from '../../application/use-cases/manage-pricing-rule.use-case';

/**
 * PricingController
 * 
 * This controller serves as the HTTP interface for pricing-related operations.
 * It delegates business logic to use cases and handles HTTP-specific concerns.
 */
@Controller('pricing')
export class PricingController {
  constructor(
    private readonly calculatePriceUseCase: CalculatePriceUseCase,
    private readonly managePricingRuleUseCase: ManagePricingRuleUseCase,
  ) {}

  // ===== PRICE CALCULATION ENDPOINTS =====

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  async calculatePrice(@Body() calculatePriceDto: CalculatePriceDto): Promise<PriceCalculationResponseDto> {
    return this.calculatePriceUseCase.execute(calculatePriceDto);
  }

  // ===== PRICING RULE MANAGEMENT ENDPOINTS =====

  @Post('rules')
  @HttpCode(HttpStatus.CREATED)
  async createPricingRule(@Body() createPricingRuleDto: CreatePricingRuleDto): Promise<PricingRuleResponseDto> {
    return this.managePricingRuleUseCase.create(createPricingRuleDto);
  }

  @Get('rules')
  async getAllPricingRules(@Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<PricingRuleResponseDto>> {
    const result = await this.managePricingRuleUseCase.getAll(paginationDto);
    return {
      data: result.pricingRules,
      total: result.total,
      page: paginationDto.page,
      limit: paginationDto.limit,
    };
  }

  @Get('rules/active')
  async getActivePricingRules(): Promise<PricingRuleResponseDto[]> {
    return this.managePricingRuleUseCase.getActive();
  }

  @Get('rules/type/:type')
  async getPricingRulesByType(@Param('type') type: string): Promise<PricingRuleResponseDto[]> {
    return this.managePricingRuleUseCase.getByType(type);
  }

  @Get('rules/:id')
  async getPricingRuleById(@Param('id', ParseIntPipe) id: number): Promise<PricingRuleResponseDto> {
    return this.managePricingRuleUseCase.getById(id);
  }

  @Patch('rules/:id')
  async updatePricingRule(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePricingRuleDto: UpdatePricingRuleDto,
  ): Promise<PricingRuleResponseDto> {
    return this.managePricingRuleUseCase.update(id, updatePricingRuleDto);
  }

  @Delete('rules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePricingRule(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.managePricingRuleUseCase.delete(id);
  }
}
