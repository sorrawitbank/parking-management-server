import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { SlotResponseDto } from '../../slots/dto/slot-response.dto';

export class AssignmentSlotResponseDto extends PickType(SlotResponseDto, [
  'slotId',
] as const) {
  @Expose()
  assignmentSlotId: number;

  @Expose()
  assignmentId: number;

  @Expose()
  assignedDate: string;

  @Expose()
  endedDate: string;

  @Expose()
  isActive: boolean;
}
