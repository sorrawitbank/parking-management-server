import { OmitType, PickType } from '@nestjs/mapped-types';
import { Expose, Type } from 'class-transformer';
import { AssignmentSlotWithAssignedDaysResponseDto } from './assignment-slot-with-assigned-days-response.dto';
import { TenantResponseDto } from '../../../tenants/dto/tenant-response.dto';

class TenantInAssignmentDto extends PickType(TenantResponseDto, [
  'tenantId',
  'name',
] as const) {}

class AssignmentSlotInAssignmentDto extends OmitType(
  AssignmentSlotWithAssignedDaysResponseDto,
  ['assignmentId'] as const,
) {}

export class AssignmentResponseDto {
  @Expose()
  assignmentId: number;

  @Expose()
  paidUntilMonth: string;

  @Expose()
  monthlyFee: number;

  @Expose()
  @Type(() => TenantInAssignmentDto)
  tenant: TenantInAssignmentDto;

  @Expose()
  @Type(() => AssignmentSlotInAssignmentDto)
  assignmentSlots: AssignmentSlotInAssignmentDto[];
}
