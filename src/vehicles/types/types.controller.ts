import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TypeResponseDto } from './dto/type-response.dto';
import { TypesService } from './types.service';

@Controller('vehicles/types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Get()
  async getVehicleTypes(): Promise<TypeResponseDto[]> {
    const vehicleTypes = await this.typesService.getVehicleTypes();

    return plainToInstance(TypeResponseDto, vehicleTypes);
  }
}
