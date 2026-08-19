import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Expose, Type } from 'class-transformer';
import { BrandResponseDto } from '../brands/dto/brand-response.dto';
import { TypeResponseDto } from '../types/dto/type-response.dto';
import { ProvinceResponseDto } from '../../provinces/dto/province-response.dto';
import { TenantResponseDto } from '../../tenants/dto/tenant-response.dto';

class TenantInVehicleDto extends PickType(TenantResponseDto, [
  'tenantId',
  'name',
] as const) {}

export class VehicleResponseDto extends IntersectionType(
  PickType(ProvinceResponseDto, ['provinceId'] as const),
  PickType(TypeResponseDto, ['vehicleTypeId'] as const),
  PickType(BrandResponseDto, ['vehicleBrandId'] as const),
) {
  @Expose()
  vehicleId: string;

  @Expose()
  licensePlatePrefix: string;

  @Expose()
  licensePlateNumber: string;

  @Expose()
  note: string | null;

  @Expose()
  @Type(() => TenantInVehicleDto)
  tenant: TenantInVehicleDto;
}
