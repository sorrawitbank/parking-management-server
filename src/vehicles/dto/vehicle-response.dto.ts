import { PickType } from '@nestjs/mapped-types';
import { Expose, Type } from 'class-transformer';
import { TenantResponseDto } from '../../tenants/dto/tenant-response.dto';

class TenantInVehicleDto extends PickType(TenantResponseDto, [
  'tenantId',
  'name',
] as const) {}

export class VehicleResponseDto {
  @Expose()
  vehicleId: string;

  @Expose()
  licensePlatePrefix: string;

  @Expose()
  licensePlateNumber: string;

  @Expose()
  provinceId: number;

  @Expose()
  vehicleTypeId: number;

  @Expose()
  vehicleBrandId: number | null;

  @Expose()
  note: string | null;

  @Expose()
  @Type(() => TenantInVehicleDto)
  tenant: TenantInVehicleDto;
}
