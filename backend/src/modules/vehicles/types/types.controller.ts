import { Controller, Get, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TypeResponseDto } from './dto/type-response.dto';
import { TypesService } from './types.service';
import { AuthGuard } from '../../auth/guards/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Get()
  async getVehicleTypes(): Promise<TypeResponseDto[]> {
    const vehicleTypes = await this.typesService.getVehicleTypes();

    return plainToInstance(TypeResponseDto, vehicleTypes);
  }
}
