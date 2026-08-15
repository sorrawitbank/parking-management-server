import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import ErrorType from '../../common/errors/error-type.enum';

export class ProvinceIdDto {
  @Max(99, { message: ErrorType.ABOVE_MAXIMUM })
  @Min(10, { message: ErrorType.BELOW_MINIMUM })
  @IsInt({ message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  readonly provinceId: number;
}
