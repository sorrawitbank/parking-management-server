import { PickType } from '@nestjs/mapped-types';
import { Expose, Type } from 'class-transformer';
import { BrandResponseDto } from '../brands/dto/brand-response.dto';
import { TypeResponseDto } from '../types/dto/type-response.dto';
import { ProvinceResponseDto } from '../../provinces/dto/province-response.dto';
import { TenantResponseDto } from '../../tenants/dto/tenant-response.dto';

class TenantInVehicleDto extends PickType(TenantResponseDto, [
  'tenantId',
  'name',
] as const) {}

class ProvinceInVehicleDto extends PickType(ProvinceResponseDto, [
  'nameTh',
  'nameEn',
] as const) {}

class TypeInVehicleDto extends PickType(TypeResponseDto, [
  'nameTh',
  'nameEn',
] as const) {}

class BrandInVehicleDto extends PickType(BrandResponseDto, [
  'nameTh',
  'nameEn',
] as const) {}

export class VehicleResponseDto {
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

  @Expose()
  @Type(() => ProvinceInVehicleDto)
  province: ProvinceInVehicleDto;

  @Expose()
  @Type(() => TypeInVehicleDto)
  vehicleType: TypeInVehicleDto;

  @Expose()
  @Type(() => BrandInVehicleDto)
  vehicleBrand: BrandInVehicleDto | null;
}
