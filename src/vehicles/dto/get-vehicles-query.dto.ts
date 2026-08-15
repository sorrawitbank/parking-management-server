import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ParseNumberArray, Trim } from '../../common/decorators';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import ErrorType from '../../common/errors/error-type.enum';

export class GetVehiclesQueryDto extends PaginationQueryDto {
  @Max(99, { each: true, message: ErrorType.ABOVE_MAXIMUM })
  @Min(10, { each: true, message: ErrorType.BELOW_MINIMUM })
  @IsInt({ each: true, message: ErrorType.INVALID_TYPE })
  @IsOptional()
  @ParseNumberArray()
  readonly provinceIds?: number[];

  @Min(1, { each: true, message: ErrorType.BELOW_MINIMUM })
  @IsInt({ each: true, message: ErrorType.INVALID_TYPE })
  @IsOptional()
  @ParseNumberArray()
  readonly vehicleTypeIds?: number[];

  @Min(1, { each: true, message: ErrorType.BELOW_MINIMUM })
  @IsInt({ each: true, message: ErrorType.INVALID_TYPE })
  @IsOptional()
  @ParseNumberArray()
  readonly vehicleBrandIds?: number[];

  @IsBoolean({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  readonly includeNullBrand?: boolean;

  @IsString({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  @Trim()
  readonly keyword?: string;
}
