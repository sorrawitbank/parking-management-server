import { IntersectionType, OmitType, PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { SlotResponseDto } from './slot-response.dto';
import { StatusResponseDto } from '../statuses/dto/status-response.dto';

export class GetSlotWithStatusResponseDto extends IntersectionType(
  PickType(SlotResponseDto, ['slotId'] as const),
  OmitType(StatusResponseDto, ['nameTh', 'nameEn'] as const),
) {
  @Expose()
  statusTh: string;

  @Expose()
  statusEn: string;
}
