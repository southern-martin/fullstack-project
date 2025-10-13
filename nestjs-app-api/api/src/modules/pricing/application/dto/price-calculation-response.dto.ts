import { PriceCalculation } from '../../domain/entities/price-calculation.entity';

export class PriceCalculationResponseDto {
  id: number;
  requestId: string;
  basePrice: number;
  finalPrice: number;
  totalDiscount: number;
  totalMarkup: number;
  inputData: any;
  appliedRules: any[];
  calculationSteps: any[];
  calculationTimeMs: number;
  isCached: boolean;
  calculatedAt: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(priceCalculation: PriceCalculation): PriceCalculationResponseDto {
    const dto = new PriceCalculationResponseDto();
    dto.id = priceCalculation.id;
    dto.requestId = priceCalculation.requestId;
    dto.basePrice = priceCalculation.basePrice;
    dto.finalPrice = priceCalculation.finalPrice;
    dto.totalDiscount = priceCalculation.totalDiscount;
    dto.totalMarkup = priceCalculation.totalMarkup;
    dto.inputData = priceCalculation.inputData;
    dto.appliedRules = priceCalculation.appliedRules;
    dto.calculationSteps = priceCalculation.calculationSteps;
    dto.calculationTimeMs = priceCalculation.calculationTimeMs;
    dto.isCached = priceCalculation.isCached;
    dto.calculatedAt = priceCalculation.calculatedAt;
    dto.metadata = priceCalculation.metadata;
    dto.createdAt = priceCalculation.createdAt;
    dto.updatedAt = priceCalculation.updatedAt;
    return dto;
  }
}
