import { OmitType } from '@nestjs/mapped-types';
import { Expose, Type } from 'class-transformer';
import { TenantResponseDto } from './tenant-response.dto';
import { VehicleResponseDto } from '../../vehicles/dto/vehicle-response.dto';

class VehicleInTenantDto extends OmitType(VehicleResponseDto, [
  'note',
  'tenant',
] as const) {}

export class GetTenantResponseDto extends TenantResponseDto {
  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  @Type(() => VehicleInTenantDto)
  vehicles: VehicleInTenantDto[];
}
