import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetSlotWithStatusResponseDto } from './dto/get-slot-with-status-response.dto';
import { SlotResponseDto } from './dto/slot-response.dto';
import { SlotsService } from './slots.service';

@Controller()
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  async getParkingSlots(): Promise<SlotResponseDto[]> {
    const parkingSlots = await this.slotsService.getParkingSlots();

    return plainToInstance(SlotResponseDto, parkingSlots);
  }

  @Get('with-status')
  async getParkingSlotsWithStatus(): Promise<GetSlotWithStatusResponseDto[]> {
    const parkingSlotsWithStatus =
      await this.slotsService.getParkingSlotsWithStatus();

    return plainToInstance(
      GetSlotWithStatusResponseDto,
      parkingSlotsWithStatus,
    );
  }
}
