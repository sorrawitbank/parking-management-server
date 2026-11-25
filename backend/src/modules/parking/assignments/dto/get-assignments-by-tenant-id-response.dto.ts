import { OmitType } from '@nestjs/mapped-types';
import { AssignmentResponseDto } from './assignment-response.dto';
import { PaginationResponseDto } from '../../../../common/dto/pagination-response.dto';

export class GetAssignmentsByTenantIdResponse extends OmitType(
  AssignmentResponseDto,
  ['tenant'] as const,
) {}

export class GetAssignmentsByTenantIdResponseDto extends PaginationResponseDto<GetAssignmentsByTenantIdResponse> {}
