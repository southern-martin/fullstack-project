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
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CalculatePriceDto } from "../../application/dto/calculate-price.dto";
import { CreatePricingRuleDto } from "../../application/dto/create-pricing-rule.dto";
import { PriceCalculationResponseDto } from "../../application/dto/price-calculation-response.dto";
import { PricingRuleResponseDto } from "../../application/dto/pricing-rule-response.dto";
import { UpdatePricingRuleDto } from "../../application/dto/update-pricing-rule.dto";
import { CalculatePriceUseCase } from "../../application/use-cases/calculate-price.use-case";
import { GetPriceCalculationHistoryUseCase } from "../../application/use-cases/get-price-calculation-history.use-case";
import { ManagePricingRuleUseCase } from "../../application/use-cases/manage-pricing-rule.use-case";

/**
 * Pricing Controller
 * Interface adapter for HTTP requests
 * Follows Clean Architecture principles
 */
@ApiTags("pricing")
@Controller("pricing")
export class PricingController {
  constructor(
    private readonly calculatePriceUseCase: CalculatePriceUseCase,
    private readonly managePricingRuleUseCase: ManagePricingRuleUseCase,
    private readonly getPriceCalculationHistoryUseCase: GetPriceCalculationHistoryUseCase
  ) {}

  // Pricing Rules Management
  /**
   * Create pricing rule endpoint
   * POST /pricing/rules
   */
  @Post("rules")
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create a new pricing rule" })
  @ApiResponse({
    status: 201,
    description: "Pricing rule successfully created",
    type: PricingRuleResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  async createPricingRule(
    @Body() createPricingRuleDto: CreatePricingRuleDto
  ): Promise<PricingRuleResponseDto> {
    return this.managePricingRuleUseCase.create(createPricingRuleDto);
  }

  /**
   * Get all pricing rules endpoint
   * GET /pricing/rules
   */
  @Get("rules")
  @ApiOperation({ summary: "Get all pricing rules with pagination" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of pricing rules" })
  async findAllPricingRules(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{ pricingRules: PricingRuleResponseDto[]; total: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.managePricingRuleUseCase.getAll(pageNum, limitNum, search);
  }

  /**
   * Get pricing rule count endpoint
   * GET /pricing/rules/count
   */
  @Get("rules/count")
  @ApiOperation({ summary: "Get total pricing rule count" })
  @ApiResponse({ status: 200, description: "Total number of pricing rules" })
  async getPricingRuleCount(): Promise<{ count: number }> {
    return this.managePricingRuleUseCase.getCount();
  }

  /**
   * Get pricing rule by ID endpoint
   * GET /pricing/rules/:id
   */
  @Get("rules/:id")
  @ApiOperation({ summary: "Get pricing rule by ID" })
  @ApiResponse({
    status: 200,
    description: "Pricing rule found",
    type: PricingRuleResponseDto,
  })
  @ApiResponse({ status: 404, description: "Pricing rule not found" })
  async findPricingRuleById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<PricingRuleResponseDto> {
    return this.managePricingRuleUseCase.getById(id);
  }

  /**
   * Update pricing rule endpoint
   * PATCH /pricing/rules/:id
   */
  @Patch("rules/:id")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update pricing rule by ID" })
  @ApiResponse({
    status: 200,
    description: "Pricing rule successfully updated",
    type: PricingRuleResponseDto,
  })
  @ApiResponse({ status: 404, description: "Pricing rule not found" })
  async updatePricingRule(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePricingRuleDto: UpdatePricingRuleDto
  ): Promise<PricingRuleResponseDto> {
    return this.managePricingRuleUseCase.update(id, updatePricingRuleDto);
  }

  /**
   * Delete pricing rule endpoint
   * DELETE /pricing/rules/:id
   */
  @Delete("rules/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete pricing rule by ID" })
  @ApiResponse({ status: 204, description: "Pricing rule successfully deleted" })
  @ApiResponse({ status: 404, description: "Pricing rule not found" })
  async deletePricingRule(
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    return this.managePricingRuleUseCase.delete(id);
  }

  // Price Calculation
  /**
   * Calculate price endpoint
   * POST /pricing/calculate
   */
  @Post("calculate")
  @ApiOperation({ summary: "Calculate price based on input parameters" })
  @ApiResponse({
    status: 200,
    description: "Price successfully calculated",
    type: PriceCalculationResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid calculation parameters" })
  async calculatePrice(
    @Body() calculatePriceDto: CalculatePriceDto
  ): Promise<PriceCalculationResponseDto> {
    return this.calculatePriceUseCase.execute(calculatePriceDto);
  }

  // Price Calculation History
  /**
   * Get price calculation history endpoint
   * GET /pricing/calculations
   */
  @Get("calculations")
  @ApiOperation({ summary: "Get price calculation history with pagination" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of price calculations" })
  async getPriceCalculationHistory(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{
    priceCalculations: PriceCalculationResponseDto[];
    total: number;
  }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.getPriceCalculationHistoryUseCase.execute(
      pageNum,
      limitNum,
      search
    );
  }

  /**
   * Get price calculation count endpoint
   * GET /pricing/calculations/count
   */
  @Get("calculations/count")
  @ApiOperation({ summary: "Get total price calculation count" })
  @ApiResponse({ status: 200, description: "Total number of price calculations" })
  async getPriceCalculationCount(): Promise<{ count: number }> {
    return this.getPriceCalculationHistoryUseCase.getCount();
  }
}
