import { IntersectionType, OmitType, PickType } from '@nestjs/mapped-types';
import { AssignmentResponseDto } from './assignment-response.dto';
import { AuditResponseDto } from '../../../../common/dto/audit-response.dto';

export class CreateAssignmentResponseDto extends IntersectionType(
  OmitType(AssignmentResponseDto, ['assignmentSlots'] as const),
  PickType(AuditResponseDto, ['createdAt' as const]),
) {}
