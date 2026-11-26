import { IntersectionType, OmitType, PickType } from '@nestjs/mapped-types';
import { AssignmentResponseDto } from './assignment-response.dto';
import { AssignmentSlotResponseDto } from './assignment-slot-response.dto';
import { AuditResponseDto } from '../../../../common/dto/audit-response.dto';

export class UpdateAssignmentResponseDto extends IntersectionType(
  OmitType(AssignmentResponseDto, ['assignmentSlots'] as const),
  PickType(AuditResponseDto, ['updatedAt'] as const),
) {}

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
