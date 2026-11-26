import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BrandResponseDto } from './dto/brand-response.dto';
import { BrandsService } from './brands.service';

@Controller()
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async getVehicleBrands(): Promise<BrandResponseDto[]> {
    const vehicleBrands = await this.brandsService.getVehicleBrands();

    return plainToInstance(BrandResponseDto, vehicleBrands);
  }
}
