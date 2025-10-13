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
import { CarrierResponseDto } from "../../application/dto/carrier-response.dto";
import { CreateCarrierDto } from "../../application/dto/create-carrier.dto";
import { UpdateCarrierDto } from "../../application/dto/update-carrier.dto";
import { CreateCarrierUseCase } from "../../application/use-cases/create-carrier.use-case";
import { DeleteCarrierUseCase } from "../../application/use-cases/delete-carrier.use-case";
import { GetCarrierUseCase } from "../../application/use-cases/get-carrier.use-case";
import { UpdateCarrierUseCase } from "../../application/use-cases/update-carrier.use-case";

/**
 * Carrier Controller
 * Interface adapter for HTTP requests
 * Follows Clean Architecture principles
 */
@Controller("carriers")
export class CarrierController {
  constructor(
    private readonly createCarrierUseCase: CreateCarrierUseCase,
    private readonly getCarrierUseCase: GetCarrierUseCase,
    private readonly updateCarrierUseCase: UpdateCarrierUseCase,
    private readonly deleteCarrierUseCase: DeleteCarrierUseCase
  ) {}

  /**
   * Create carrier endpoint
   * POST /carriers
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCarrierDto: CreateCarrierDto
  ): Promise<CarrierResponseDto> {
    return this.createCarrierUseCase.execute(createCarrierDto);
  }

  /**
   * Get all carriers endpoint
   * GET /carriers
   */
  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{ carriers: CarrierResponseDto[]; total: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.getCarrierUseCase.executeAll(pageNum, limitNum, search);
  }

  /**
   * Get active carriers endpoint
   * GET /carriers/active
   */
  @Get("active")
  async findActive(): Promise<CarrierResponseDto[]> {
    return this.getCarrierUseCase.executeActive();
  }

  /**
   * Get carrier count endpoint
   * GET /carriers/count
   */
  @Get("count")
  async getCount(): Promise<{ count: number }> {
    return this.getCarrierUseCase.executeCount();
  }

  /**
   * Get carrier by name endpoint
   * GET /carriers/name/:name
   */
  @Get("name/:name")
  async findByName(@Param("name") name: string): Promise<CarrierResponseDto> {
    return this.getCarrierUseCase.executeByName(name);
  }

  /**
   * Get carrier by ID endpoint
   * GET /carriers/:id
   */
  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<CarrierResponseDto> {
    return this.getCarrierUseCase.executeById(id);
  }

  /**
   * Update carrier endpoint
   * PATCH /carriers/:id
   */
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCarrierDto: UpdateCarrierDto
  ): Promise<CarrierResponseDto> {
    return this.updateCarrierUseCase.execute(id, updateCarrierDto);
  }

  /**
   * Delete carrier endpoint
   * DELETE /carriers/:id
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.deleteCarrierUseCase.execute(id);
  }
}
