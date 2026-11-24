import { Expose, Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import { AssignmentResponseDto } from './assignment-response.dto';
import { AssignmentSlotWithAssignedDaysResponseDto } from './assignment-slot-with-assigned-days-response.dto';

class AssignmentInAssignmentSlot extends OmitType(AssignmentResponseDto, [
  'paidUntilMonth',
  'assignmentSlots',
] as const) {}

export class GetAssignmentSlotsBySlotIdResponse extends OmitType(
  AssignmentSlotWithAssignedDaysResponseDto,
  ['assignmentId', 'slotId'] as const,
) {
  @Expose()
  @Type(() => AssignmentInAssignmentSlot)
  assignment: AssignmentInAssignmentSlot;
}

export class GetAssignmentSlotsBySlotIdResponseDto {
  @Expose()
  @Type(() => GetAssignmentSlotsBySlotIdResponse)
  data: GetAssignmentSlotsBySlotIdResponse[];

  @Expose()
  year: number;
}
