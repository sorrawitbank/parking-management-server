import { IntersectionType } from '@nestjs/mapped-types';
import { AssignmentResponseDto } from './assignment-response.dto';
import { AuditResponseDto } from '../../../../common/dto/audit-response.dto';

export class GetAssignmentResponseDto extends IntersectionType(
  AssignmentResponseDto,
  AuditResponseDto,
) {}
