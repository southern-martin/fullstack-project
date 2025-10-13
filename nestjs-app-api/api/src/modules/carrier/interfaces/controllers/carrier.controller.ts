import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";

// Use Cases
import { CreateCarrierUseCase } from "../../application/use-cases/create-carrier.use-case";
import { DeleteCarrierUseCase } from "../../application/use-cases/delete-carrier.use-case";
import { GetCarrierUseCase } from "../../application/use-cases/get-carrier.use-case";
import { UpdateCarrierUseCase } from "../../application/use-cases/update-carrier.use-case";

// DTOs
import { CarrierResponseDto } from "../../application/dto/carrier-response.dto";
import { CreateCarrierDto } from "../../application/dto/create-carrier.dto";
import { UpdateCarrierDto } from "../../application/dto/update-carrier.dto";

/**
 * CarrierController
 *
 * This controller handles HTTP requests for carrier operations.
 * It delegates business logic to use cases and returns appropriate HTTP responses.
 */
@Controller("api/v1/carriers")
export class CarrierController {
  constructor(
    private readonly createCarrierUseCase: CreateCarrierUseCase,
    private readonly getCarrierUseCase: GetCarrierUseCase,
    private readonly updateCarrierUseCase: UpdateCarrierUseCase,
    private readonly deleteCarrierUseCase: DeleteCarrierUseCase
  ) {}

  /**
   * Create a new carrier.
   * @param createCarrierDto The data for creating the carrier.
   * @returns Created carrier response.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCarrierDto: CreateCarrierDto
  ): Promise<CarrierResponseDto> {
    return this.createCarrierUseCase.execute(createCarrierDto);
  }

  /**
   * Get all carriers with optional pagination and search.
   * @param page Page number (1-based).
   * @param limit Number of items per page.
   * @param search Optional search term.
   * @returns List of carriers or paginated response.
   */
  @Get()
  async getAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string
  ): Promise<
    | CarrierResponseDto[]
    | {
        carriers: CarrierResponseDto[];
        total: number;
        page: number;
        limit: number;
      }
  > {
    if (page && limit) {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      return this.getCarrierUseCase.getPaginated(pageNum, limitNum, search);
    }
    return this.getCarrierUseCase.getAll();
  }

  /**
   * Get active carriers only.
   * @returns List of active carriers.
   */
  @Get("active")
  async getActive(): Promise<CarrierResponseDto[]> {
    return this.getCarrierUseCase.getActive();
  }

  /**
   * Get carrier count.
   * @returns Total number of carriers.
   */
  @Get("count")
  async getCount(): Promise<{ count: number }> {
    return this.getCarrierUseCase.getCount();
  }

  /**
   * Get a carrier by ID.
   * @param id The carrier ID.
   * @returns Carrier response.
   */
  @Get(":id")
  async getById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<CarrierResponseDto> {
    return this.getCarrierUseCase.getById(id);
  }

  /**
   * Get a carrier by code.
   * @param code The carrier code.
   * @returns Carrier response.
   */
  @Get("code/:code")
  async getByCode(@Param("code") code: string): Promise<CarrierResponseDto> {
    return this.getCarrierUseCase.getByCode(code);
  }

  /**
   * Update a carrier.
   * @param id The carrier ID.
   * @param updateCarrierDto The data for updating the carrier.
   * @returns Updated carrier response.
   */
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCarrierDto: UpdateCarrierDto
  ): Promise<CarrierResponseDto> {
    return this.updateCarrierUseCase.execute(id, updateCarrierDto);
  }

  /**
   * Delete a carrier.
   * @param id The carrier ID.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.deleteCarrierUseCase.execute(id);
  }
}
