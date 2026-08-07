import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetSlotResponseDto } from './dto/get-slot-response.dto';
import { SlotsService } from './slots.service';

@Controller()
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  async getParkingSlots(): Promise<GetSlotResponseDto[]> {
    const parkingSlots = await this.slotsService.getParkingSlots();

    return plainToInstance(GetSlotResponseDto, parkingSlots);
  }
}
