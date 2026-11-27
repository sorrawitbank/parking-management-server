import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import ErrorType from '../../../../common/enums/error-type.enum';

export class TypeIdDto {
  @Min(1, { message: ErrorType.BELOW_MINIMUM })
  @IsInt({ message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  @Type(() => Number)
  readonly vehicleTypeId: number;
}
