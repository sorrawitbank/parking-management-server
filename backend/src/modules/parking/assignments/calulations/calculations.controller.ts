import { Controller, Get, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CalculationsService } from './calculations.service';
import { GetCancelDataQueryDto } from './dto/get-cancel-data-query.dto';
import { GetCancelDataResponseDto } from './dto/get-cancel-data-response.dto';
import { GetRentDataQueryDto } from './dto/get-rent-data-query.dto';
import { GetRentDataResponseDto } from './dto/get-rent-data-response.dto';

@Controller()
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Get('rent')
  async getRentData(
    @Query() query: GetRentDataQueryDto,
  ): Promise<GetRentDataResponseDto> {
    const { assignedDate, monthlyFee } = query;

    const data = {
      fee: this.calculationsService.calculateFee(assignedDate, monthlyFee),
      paidUntilMonth:
        this.calculationsService.calculatePaidUntilMonth(assignedDate),
    };

    return plainToInstance(GetRentDataResponseDto, data);
  }

  @Get('cancel')
  async getCancelData(
    @Query() query: GetCancelDataQueryDto,
  ): Promise<GetCancelDataResponseDto> {
    const { endedDate, monthlyFee } = query;

    const data = {
      cancelFee: this.calculationsService.calculateCancelFee(
        endedDate,
        monthlyFee,
      ),
    };

    return plainToInstance(GetCancelDataResponseDto, data);
  }
}
