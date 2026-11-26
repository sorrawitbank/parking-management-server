import { OmitType } from '@nestjs/mapped-types';
import { AssignmentResponseDto } from './assignment-response.dto';
import { PaginationResponseDto } from '../../../../common/dto/pagination-response.dto';

export class GetAssignmentsResponse extends OmitType(AssignmentResponseDto, [
  'assignmentSlots',
] as const) {}

export class GetAssignmentsResponseDto extends PaginationResponseDto<GetAssignmentsResponse> {}
