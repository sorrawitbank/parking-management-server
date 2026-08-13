import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { SlotResponseDto } from './slot-response.dto';
import { StatusResponseDto } from '../statuses/dto/status-response.dto';

export class GetSlotWithStatusResponseDto extends IntersectionType(
  PickType(SlotResponseDto, ['slotId'] as const),
  PickType(StatusResponseDto, ['slotStatusId'] as const),
) {}
