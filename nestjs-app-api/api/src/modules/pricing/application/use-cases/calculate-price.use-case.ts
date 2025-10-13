import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PricingRuleRepositoryInterface } from '../../domain/repositories/pricing-rule.repository.interface';
import { PriceCalculationRepositoryInterface } from '../../domain/repositories/price-calculation.repository.interface';
import { PricingDomainService } from '../../domain/services/pricing.domain.service';
import { PriceCalculatedEvent } from '../../domain/events/price-calculated.event';
import { CalculatePriceDto } from '../dto/calculate-price.dto';
import { PriceCalculationResponseDto } from '../dto/price-calculation-response.dto';
import { PriceCalculation } from '../../domain/entities/price-calculation.entity';
import { v4 as uuidv4 } from 'uuid';

/**
 * CalculatePriceUseCase
 * 
 * This use case handles the calculation of prices based on pricing rules.
 * It orchestrates the domain logic and persistence (repository).
 */
@Injectable()
export class CalculatePriceUseCase {
  constructor(
    private readonly pricingRuleRepository: PricingRuleRepositoryInterface,
    private readonly priceCalculationRepository: PriceCalculationRepositoryInterface,
    private readonly pricingDomainService: PricingDomainService
  ) {}

  /**
   * Calculates the final price based on base price and applicable pricing rules.
   * @param calculatePriceDto The data for price calculation.
   * @returns Calculated price result
   */
  async execute(calculatePriceDto: CalculatePriceDto): Promise<PriceCalculationResponseDto> {
    const startTime = Date.now();

    // 1. Generate unique request ID
    const requestId = uuidv4();

    // 2. Check if we have a cached calculation for the same input
    const cachedCalculation = await this.findCachedCalculation(calculatePriceDto);
    if (cachedCalculation) {
      return PriceCalculationResponseDto.fromDomain(cachedCalculation);
    }

    // 3. Get applicable pricing rules
    const applicableRules = await this.pricingRuleRepository.findApplicable(calculatePriceDto);

    // 4. Calculate price using domain service
    const calculationResult = this.pricingDomainService.calculatePrice(
      calculatePriceDto.basePrice,
      applicableRules,
      calculatePriceDto
    );

    // 5. Calculate execution time
    const calculationTimeMs = Date.now() - startTime;

    // 6. Create price calculation record
    const priceCalculation = new PriceCalculation();
    priceCalculation.requestId = requestId;
    priceCalculation.basePrice = calculatePriceDto.basePrice;
    priceCalculation.finalPrice = calculationResult.finalPrice;
    priceCalculation.totalDiscount = calculationResult.totalDiscount;
    priceCalculation.totalMarkup = calculationResult.totalMarkup;
    priceCalculation.inputData = calculatePriceDto;
    priceCalculation.appliedRules = calculationResult.appliedRules;
    priceCalculation.calculationSteps = calculationResult.calculationSteps;
    priceCalculation.calculationTimeMs = calculationTimeMs;
    priceCalculation.isCached = false;
    priceCalculation.calculatedAt = new Date();
    priceCalculation.metadata = {};

    // 7. Save calculation record
    const savedCalculation = await this.priceCalculationRepository.create(priceCalculation);

    // 8. Raise domain event
    const priceCalculatedEvent = new PriceCalculatedEvent(savedCalculation);
    // In a real application, you would publish this event to an event bus
    // this.eventBus.publish(priceCalculatedEvent);

    // 9. Return response
    return PriceCalculationResponseDto.fromDomain(savedCalculation);
  }

  /**
   * Finds a cached calculation for the same input data.
   * @param calculatePriceDto The input data for calculation.
   * @returns Cached calculation if found, null otherwise.
   */
  private async findCachedCalculation(calculatePriceDto: CalculatePriceDto): Promise<PriceCalculation | null> {
    // In a real application, you might implement more sophisticated caching logic
    // For now, we'll return null to always calculate fresh prices
    return null;
  }
}
