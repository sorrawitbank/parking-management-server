import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { BrandIdDto } from '../brands/dto/brand-id.dto';
import { TypeIdDto } from '../types/dto/type-id.dto';
import { Trim } from '../../common/decorators';
import ErrorType from '../../common/errors/error-type.enum';
import { ProvinceIdDto } from '../../provinces/dto/province-id.dto';
import { TenantIdDto } from '../../tenants/dto/tenant-id.dto';

export class CreateVehicleDto extends IntersectionType(
  TenantIdDto,
  ProvinceIdDto,
  TypeIdDto,
  PartialType(BrandIdDto),
) {
  @MaxLength(10, { message: ErrorType.TOO_LONG })
  @Matches(/^\S+$/, { message: ErrorType.INVALID_FORMAT })
  @IsString({ message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  @Trim()
  readonly licensePlatePrefix: string;

  @MaxLength(10, { message: ErrorType.TOO_LONG })
  @IsNumberString(undefined, { message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  @Trim()
  readonly licensePlateNumber: string;

  @Length(1, 500, { message: ErrorType.INVALID_LENGTH })
  @IsString({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  @Trim()
  readonly note?: string | null;
}
