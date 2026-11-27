import { Controller, Get, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StatusResponseDto } from './dto/status-response.dto';
import { StatusesService } from './statuses.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Get()
  async getParkingSlotStatuses(): Promise<StatusResponseDto[]> {
    const parkingSlotStatuses =
      await this.statusesService.getParkingSlotStatuses();

    return plainToInstance(StatusResponseDto, parkingSlotStatuses);
  }
}
