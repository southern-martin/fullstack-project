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
import { CarrierResponseDto } from "../application/dto/carrier-response.dto";
import { CreateCarrierDto } from "../application/dto/create-carrier.dto";
import { UpdateCarrierDto } from "../application/dto/update-carrier.dto";
import { CarrierService } from "../application/services/carrier.service";

@Controller("carriers")
export class CarrierController {
  constructor(private readonly carrierService: CarrierService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCarrierDto: CreateCarrierDto
  ): Promise<CarrierResponseDto> {
    return await this.carrierService.create(createCarrierDto);
  }

  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string
  ): Promise<{ carriers: CarrierResponseDto[]; total: number }> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return await this.carrierService.findAll(pageNum, limitNum, search);
  }

  @Get("active")
  async findActive(): Promise<CarrierResponseDto[]> {
    return await this.carrierService.findActive();
  }

  @Get("count")
  async getCount(): Promise<{ count: number }> {
    return await this.carrierService.getCount();
  }

  @Get("name/:name")
  async findByName(@Param("name") name: string): Promise<CarrierResponseDto> {
    return await this.carrierService.findByName(name);
  }

  @Get(":id")
  async findById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<CarrierResponseDto> {
    return await this.carrierService.findById(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCarrierDto: UpdateCarrierDto
  ): Promise<CarrierResponseDto> {
    return await this.carrierService.update(id, updateCarrierDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.carrierService.delete(id);
  }
}
