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
import { CalculatePriceDto } from "../application/dto/calculate-price.dto";
import { CreatePricingRuleDto } from "../application/dto/create-pricing-rule.dto";
import { PriceCalculationResponseDto } from "../application/dto/price-calculation-response.dto";
import { PricingRuleResponseDto } from "../application/dto/pricing-rule-response.dto";
import { UpdatePricingRuleDto } from "../application/dto/update-pricing-rule.dto";
import { PricingService } from "../application/services/pricing.service";

@Controller("pricing")
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  // Pricing Rules Management
  @Post("rules")
  @HttpCode(HttpStatus.CREATED)
  async createPricingRule(
    @Body() createPricingRuleDto: CreatePricingRuleDto
  ): Promise<PricingRuleResponseDto> {
    return await this.pricingService.createPricingRule(createPricingRuleDto);
  }

  @Get("rules")
  async findAllPricingRules(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{ pricingRules: PricingRuleResponseDto[]; total: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return await this.pricingService.findAllPricingRules(
      pageNum,
      limitNum,
      search
    );
  }

  @Get("rules/count")
  async getPricingRuleCount(): Promise<{ count: number }> {
    return await this.pricingService.getPricingRuleCount();
  }

  @Get("rules/:id")
  async findPricingRuleById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<PricingRuleResponseDto> {
    return await this.pricingService.findPricingRuleById(id);
  }

  @Patch("rules/:id")
  async updatePricingRule(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePricingRuleDto: UpdatePricingRuleDto
  ): Promise<PricingRuleResponseDto> {
    return await this.pricingService.updatePricingRule(
      id,
      updatePricingRuleDto
    );
  }

  @Delete("rules/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePricingRule(
    @Param("id", ParseIntPipe) id: number
  ): Promise<void> {
    return await this.pricingService.deletePricingRule(id);
  }

  // Price Calculation
  @Post("calculate")
  async calculatePrice(
    @Body() calculatePriceDto: CalculatePriceDto
  ): Promise<PriceCalculationResponseDto> {
    return await this.pricingService.calculatePrice(calculatePriceDto);
  }

  // Price Calculation History
  @Get("calculations")
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
    return await this.pricingService.getPriceCalculationHistory(
      pageNum,
      limitNum,
      search
    );
  }

  @Get("calculations/count")
  async getPriceCalculationCount(): Promise<{ count: number }> {
    return await this.pricingService.getPriceCalculationCount();
  }
}




