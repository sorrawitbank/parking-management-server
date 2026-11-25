import { OmitType, PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { AssignmentResponseDto } from './assignment-response.dto';
import { AssignmentSlotResponseDto } from './assignment-slot-response.dto';

export class UpdateAssignmentResponseDto extends OmitType(
  AssignmentResponseDto,
  ['assignmentSlots'] as const,
) {
  @Expose()
  updatedAt: string;
}

export class PayAssignmentResponseDto extends PickType(AssignmentResponseDto, [
  'assignmentId',
  'paidUntilMonth',
] as const) {}

export class MoveAssignmentResponseDto extends PickType(
  AssignmentSlotResponseDto,
  ['assignmentId', 'slotId'] as const,
) {}

export class CancelAssignmentResponseDto extends PickType(
  AssignmentSlotResponseDto,
  ['assignmentId', 'endedDate', 'isActive'] as const,
) {}
