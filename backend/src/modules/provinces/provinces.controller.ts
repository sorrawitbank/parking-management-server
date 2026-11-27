import { Controller, Get, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProvinceResponseDto } from './dto/province-response.dto';
import { ProvincesService } from './provinces.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Get()
  async getProvinces(): Promise<ProvinceResponseDto[]> {
    const provinces = await this.provincesService.getProvinces();

    return plainToInstance(ProvinceResponseDto, provinces);
  }
}
