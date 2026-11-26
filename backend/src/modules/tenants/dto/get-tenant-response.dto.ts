import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Expose, Type } from 'class-transformer';
import { TenantResponseDto } from './tenant-response.dto';
import { AuditResponseDto } from '../../../common/dto/audit-response.dto';
import { VehicleResponseDto } from '../../../modules/vehicles/dto/vehicle-response.dto';

class VehicleInTenantDto extends OmitType(VehicleResponseDto, [
  'note',
  'tenant',
] as const) {}

export class GetTenantResponseDto extends IntersectionType(
  TenantResponseDto,
  AuditResponseDto,
) {
  @Expose()
  @Type(() => VehicleInTenantDto)
  vehicles: VehicleInTenantDto[];
}
