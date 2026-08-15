import { IsInt, IsNotEmpty, Min } from 'class-validator';
import ErrorType from '../../../common/errors/error-type.enum';

export class BrandIdDto {
  @Min(1, { message: ErrorType.BELOW_MINIMUM })
  @IsInt({ message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  readonly vehicleBrandId: number;
}
