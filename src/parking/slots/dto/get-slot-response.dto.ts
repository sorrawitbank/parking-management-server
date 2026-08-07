import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { SlotResponseDto } from './slot-response.dto';
import { StatusResponseDto } from '../statuses/dto/status-response.dto';

export class GetSlotResponseDto extends IntersectionType(
  SlotResponseDto,
  OmitType(StatusResponseDto, ['nameTh', 'nameEn'] as const),
) {
  @Expose()
  statusTh: string;

  @Expose()
  statusEn: string;
}
