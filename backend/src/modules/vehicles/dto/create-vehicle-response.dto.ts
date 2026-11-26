import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { VehicleResponseDto } from './vehicle-response.dto';
import { AuditResponseDto } from '../../../common/dto/audit-response.dto';

export class CreateVehicleResponseDto extends IntersectionType(
  VehicleResponseDto,
  PickType(AuditResponseDto, ['createdAt' as const]),
) {}
