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
  ApiResponse,
  ApiTags,
  ApiQuery,
} from "@nestjs/swagger";
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
@ApiTags("carriers")
@Controller("carriers")
export class CarrierController {
  constructor(
    private readonly createCarrierUseCase: CreateCarrierUseCase,
    private readonly getCarrierUseCase: GetCarrierUseCase,
    private readonly updateCarrierUseCase: UpdateCarrierUseCase,
    private readonly deleteCarrierUseCase: DeleteCarrierUseCase
  ) {}

  /**
   * Health check endpoint
   * GET /carriers/health
   */
  @Get('health')
  @ApiOperation({ summary: "Health check for carrier service via carriers route" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
  }> {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "carrier-service",
    };
  }

  /**
   * Create carrier endpoint
   * POST /carriers
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new carrier" })
  @ApiResponse({
    status: 201,
    description: "Carrier successfully created",
    type: CarrierResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({ status: 409, description: "Carrier already exists" })
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
  @ApiOperation({ summary: "Get all carriers with pagination" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search by carrier name",
  })
  @ApiResponse({
    status: 200,
    description: "List of carriers with pagination",
  })
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
  @ApiOperation({ summary: "Get all active carriers" })
  @ApiResponse({
    status: 200,
    description: "List of active carriers",
    type: [CarrierResponseDto],
  })
  async findActive(): Promise<CarrierResponseDto[]> {
    return this.getCarrierUseCase.executeActive();
  }

  /**
   * Get carrier count endpoint
   * GET /carriers/count
   */
  @Get("count")
  @ApiOperation({ summary: "Get total carrier count" })
  @ApiResponse({ status: 200, description: "Total number of carriers" })
  async getCount(): Promise<{ count: number }> {
    return this.getCarrierUseCase.executeCount();
  }

  /**
   * Get carrier by name endpoint
   * GET /carriers/name/:name
   */
  @Get("name/:name")
  @ApiOperation({ summary: "Get carrier by name" })
  @ApiResponse({
    status: 200,
    description: "Carrier found",
    type: CarrierResponseDto,
  })
  @ApiResponse({ status: 404, description: "Carrier not found" })
  async findByName(@Param("name") name: string): Promise<CarrierResponseDto> {
    return this.getCarrierUseCase.executeByName(name);
  }

  /**
   * Get carrier by ID endpoint
   * GET /carriers/:id
   */
  @Get(":id")
  @ApiOperation({ summary: "Get carrier by ID" })
  @ApiResponse({
    status: 200,
    description: "Carrier found",
    type: CarrierResponseDto,
  })
  @ApiResponse({ status: 404, description: "Carrier not found" })
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
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update carrier by ID" })
  @ApiResponse({
    status: 200,
    description: "Carrier successfully updated",
    type: CarrierResponseDto,
  })
  @ApiResponse({ status: 404, description: "Carrier not found" })
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
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete carrier by ID" })
  @ApiResponse({ status: 204, description: "Carrier successfully deleted" })
  @ApiResponse({ status: 404, description: "Carrier not found" })
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.deleteCarrierUseCase.execute(id);
  }
}
