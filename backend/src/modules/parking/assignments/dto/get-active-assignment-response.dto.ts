import { IntersectionType, OmitType, PickType } from '@nestjs/mapped-types';
import { Expose, Type } from 'class-transformer';
import { AssignmentResponseDto } from './assignment-response.dto';
import { AssignmentSlotWithAssignedDaysResponseDto } from './assignment-slot-with-assigned-days-response.dto';
import { StatusResponseDto } from '../statuses/dto/status-response.dto';
import { SlotResponseDto as ParkingSlotResponseDto } from '../../slots/dto/slot-response.dto';
import { TenantResponseDto } from '../../../tenants/dto/tenant-response.dto';

export class GetActiveAssignmentResponseDto extends IntersectionType(
  OmitType(AssignmentResponseDto, ['tenant', 'assignmentSlots'] as const),
  PickType(ParkingSlotResponseDto, ['slotId'] as const),
  PickType(StatusResponseDto, ['assignmentStatusId'] as const),
  PickType(AssignmentSlotWithAssignedDaysResponseDto, [
    'assignedDate',
    'assignedDays',
  ] as const),
) {
  @Expose()
  @Type(() => TenantResponseDto)
  tenant: TenantResponseDto;
}
