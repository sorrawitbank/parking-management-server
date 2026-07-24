import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProvinceResponseDto } from './dto/province-response.dto';
import { ProvincesService } from './provinces.service';

@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Get()
  async getProvinces(): Promise<ProvinceResponseDto[]> {
    const provinces = await this.provincesService.getProvinces();

    return plainToInstance(ProvinceResponseDto, provinces);
  }
}
