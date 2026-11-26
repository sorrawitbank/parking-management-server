import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StatusResponseDto } from './dto/status-response.dto';
import { StatusesService } from './statuses.service';

@Controller()
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Get()
  async getParkingAssignmentStatuses(): Promise<StatusResponseDto[]> {
    const parkingAssignmentStatuses =
      await this.statusesService.getParkingAssignmentStatuses();

    return plainToInstance(StatusResponseDto, parkingAssignmentStatuses);
  }
}
