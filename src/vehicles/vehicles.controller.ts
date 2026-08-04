import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateVehicleResponseDto } from './dto/create-vehicle-response.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { GetVehicleResponseDto } from './dto/get-vehicle-response.dto';
import { GetVehiclesQueryDto } from './dto/get-vehicles-query.dto';
import {
  GetVehiclesResponse,
  GetVehiclesResponseDto,
} from './dto/get-vehicles-response.dto';
import { UpdateVehicleResponseDto } from './dto/update-vehicle-response.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleIdDto } from './dto/vehicle-id.dto';
import { VehiclesService } from './vehicles.service';

@Controller()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async getVehicles(
    @Query() query: GetVehiclesQueryDto,
  ): Promise<GetVehiclesResponseDto> {
    const { vehicles, pagination } =
      await this.vehiclesService.getVehicles(query);

    return {
      data: plainToInstance(GetVehiclesResponse, vehicles),
      pagination,
    };
  }

  @Get(':vehicleId')
  async getVehicleById(
    @Param() params: VehicleIdDto,
  ): Promise<GetVehicleResponseDto> {
    const vehicle = await this.vehiclesService.getVehicleById(params.vehicleId);

    return plainToInstance(GetVehicleResponseDto, vehicle);
  }

  @Post()
  async createVehicle(
    @Body() body: CreateVehicleDto,
  ): Promise<CreateVehicleResponseDto> {
    const createdVehicle = await this.vehiclesService.createVehicle(body);

    return plainToInstance(CreateVehicleResponseDto, createdVehicle);
  }

  @Put(':vehicleId')
  async updateVehicle(
    @Param() params: VehicleIdDto,
    @Body() body: UpdateVehicleDto,
  ): Promise<UpdateVehicleResponseDto> {
    const updatedVehicle = await this.vehiclesService.updateVehicle(
      params.vehicleId,
      body,
    );

    return plainToInstance(UpdateVehicleResponseDto, updatedVehicle);
  }

  @Delete(':vehicleId')
  async deleteVehicle(@Param() params: VehicleIdDto) {
    await this.vehiclesService.deleteVehicle(params.vehicleId);
  }
}
