import { IntersectionType } from '@nestjs/mapped-types';
import { VehicleResponseDto } from './vehicle-response.dto';
import { AuditResponseDto } from '../../../common/dto/audit-response.dto';

export class GetVehicleResponseDto extends IntersectionType(
  VehicleResponseDto,
  AuditResponseDto,
) {}
